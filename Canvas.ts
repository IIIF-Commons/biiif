const { basename, dirname, extname, join } = require('path');
const annotationBoilerplate = require('./boilerplate/annotation');
const imageServiceBoilerplate = require('./boilerplate/imageservice');
const chalk = require('chalk');
const config = require('./config');
const urljoin = require('url-join');
import { Directory } from './Directory';
import { Motivations } from './Motivations';
import { promise as glob } from 'glob-promise';
import { Types } from "./Types";
import { Utils } from './Utils';

export class Canvas {

    public canvasJson: any;
    public directory: Directory;
    public parentDirectory: Directory;
    public filePath: string;
    public directoryPath: string;
    public infoYml: any = {};
    public url: URL;

    constructor(filePath: string, parentDirectory: Directory) {
        this.filePath = filePath;

        if (extname(this.filePath)) {
            this.directoryPath = dirname(this.filePath);
        } else {
            this.directoryPath = this.filePath;
        }
                
        this.parentDirectory = parentDirectory;
        // we only need a directory object to reference the parent directory when determining the virtual path of this canvas
        // this.directory.read() is never called.
        this.directory = new Directory(this.directoryPath, this.parentDirectory.url.href, this.parentDirectory.generateThumbs, undefined, this.parentDirectory);
        this.url = parentDirectory.url;
    }

    private _isCanvasDirectory(): boolean {
        return basename(this.directoryPath).startsWith('_');
    }

    public async read(canvasJson: any): Promise<void> {

        this.canvasJson = canvasJson;
        await this._getInfo();
        this._applyInfo();

        // if the directoryPath starts with an underscore
        if (this._isCanvasDirectory()) {

            // first, determine if there are any custom annotations (files ending in .yml that aren't info.yml)
            // if there are, loop through them creating the custom annotations.
            // if none of them has a motivation of 'painting', loop through all paintable file types adding them to the canvas.

            const customAnnotationFiles: string[] = await glob(this.directoryPath + '/*.yml', {
                ignore: [
                    '**/info.yml'
                ]
            });

            let hasPaintingAnnotation: boolean = false;

            await Promise.all(customAnnotationFiles.map(async (file: string) => {

                let directoryName: string = dirname(file);
                directoryName = directoryName.substr(directoryName.lastIndexOf('/'));
                const name: string = basename(file, extname(file));
                const annotationJson: any = Utils.cloneJson(annotationBoilerplate);
                const yml: any = await Utils.readYml(file);

                annotationJson.id = urljoin(canvasJson.id, 'annotation', canvasJson.items[0].items.length);

                let motivation: string | undefined = yml.motivation;

                if (!motivation) {
                    // assume painting
                    motivation = Motivations.PAINTING;
                    console.warn(chalk.yellow('motivation property missing in ' + file + ', guessed ' + motivation));
                }

                annotationJson.motivation = motivation;
                annotationJson.target = canvasJson.id;

                let id: string;

                // if the motivation is painting, or isn't recognised, set the id to the path of the yml value
                if ((motivation.toLowerCase() === Motivations.PAINTING || !config.annotation.motivations[motivation]) && yml.value && extname(yml.value)) {                    
                    hasPaintingAnnotation = true;
                    id = urljoin(this.url.href, directoryName, yml.value);

                    // if the painting annotation has a target.
                    if (yml.xywh) {
                        id += '#xywh=' + yml.xywh;
                    }

                } else {
                    id = urljoin(this.url.href, 'index.json', 'annotations', name);
                }

                annotationJson.body.id = id;

                if (yml.type) {
                    annotationJson.body.type = yml.type;
                } else if (yml.value && extname(yml.value)) {
                    // guess the type from the extension
                    const type: string | undefined = Utils.getTypeByExtension(motivation, extname(yml.value));

                    if (type) {
                        annotationJson.body.type = type;
                        console.warn(chalk.yellow('type property missing in ' + file + ', guessed ' + type));
                    }

                } else if (yml.format) {
                    // guess the type from the format
                    const type: string | undefined = Utils.getTypeByFormat(motivation, yml.format);

                    if (type) {
                        annotationJson.body.type = type;
                        console.warn(chalk.yellow('type property missing in ' + file + ', guessed ' + type));
                    }
                }

                if (!annotationJson.body.type) {
                    delete annotationJson.body.type;
                    console.warn(chalk.yellow('unable to determine type of ' + file));
                }

                if (yml.format) {
                    annotationJson.body.format = yml.format;
                } else if (yml.value && extname(yml.value) && yml.type) {
                    // guess the format from the extension and type
                    const format: string | undefined = Utils.getFormatByExtensionAndType(motivation, extname(yml.value), yml.type);

                    if (format) {
                        annotationJson.body.format = format;
                        console.warn(chalk.yellow('format property missing in ' + file + ', guessed ' + format));
                    }
                } else if (yml.value && extname(yml.value)) {
                    // guess the format from the extension
                    const format: string | undefined = Utils.getFormatByExtension(motivation, extname(yml.value));

                    if (format) {
                        annotationJson.body.format = format;
                        console.warn(chalk.yellow('format property missing in ' + file + ', guessed ' + format));
                    }
                } else if (yml.type) {
                    // can only guess the format from the type if there is one typeformat for this motivation.
                    const format: string | undefined = Utils.getFormatByType(motivation, yml.type);

                    if (format) {
                        annotationJson.body.format = format;
                        console.warn(chalk.yellow('format property missing in ' + file + ', guessed ' + format));
                    } 
                }

                if (!annotationJson.body.format) {
                    delete annotationJson.body.format;
                    console.warn(chalk.yellow('unable to determine format of ' + file));
                }
                
                annotationJson.body.label = Utils.getLabel(this.infoYml.label);

                // if the annotation is an image and the id points to an info.json
                // add an image service pointing to the info.json
                if (annotationJson.body.type && annotationJson.body.type.toLowerCase() === Types.IMAGE && extname(annotationJson.body.id) === '.json') {
                    const service: any = Utils.cloneJson(imageServiceBoilerplate);
                    service[0].id = annotationJson.body.id.substr(0, annotationJson.body.id.lastIndexOf('/'));
                    annotationJson.body.service = service;
                }

                // if there's a value, and we're using a recognised motivation (except painting)
                if (yml.value && config.annotation.motivations[motivation] && motivation !== Motivations.PAINTING) {
                    annotationJson.body.value = yml.value;
                }

                canvasJson.items[0].items.push(annotationJson);          
            }));

            if (!hasPaintingAnnotation) {
                // for each jpg/pdf/mp4/obj in the canvas directory
                // add a painting annotation
                const paintableFiles: string[] = await glob(this.directoryPath + '/*.*', {
                    ignore: [
                        '**/thumb.*' // ignore thumbs
                    ]
                });

                this._annotateFiles(canvasJson, paintableFiles);
            }

        } else {
            // a file was passed (not a directory starting with an underscore)
            // therefore, just annotate that file onto the canvas.
            this._annotateFiles(canvasJson, [this.filePath]);
        }

        if (!canvasJson.items[0].items.length) {
            console.warn(chalk.yellow('Could not find any files to annotate onto ' + this.directoryPath));
        }

        // if there's no thumb.[jpg, gif, png] generate one from the first painted image
        await Utils.getThumbnail(this.canvasJson, this.directory, this.directoryPath);
    }

    private _annotateFiles(canvasJson: any, files: string[]): void {
        
        files.forEach((file: string) => {

            file = Utils.normaliseFilePath(file);
            const extName: string = extname(file);

            // if config.annotation has a matching extension
            let defaultPaintingExtension: any = config.annotation.motivations.painting[extName];

            let directoryName: string = '';

            // if the canvas is being generated from a canvas directory (starts with an _)
            if (this._isCanvasDirectory()) {
                directoryName = dirname(file);
                directoryName = directoryName.substr(directoryName.lastIndexOf('/'));
            }
            
            const fileName: string = basename(file);
            const id: string = urljoin(this.url.href, directoryName, fileName);

            if (defaultPaintingExtension) {
                defaultPaintingExtension = defaultPaintingExtension[0];
                const annotationJson: any = Utils.cloneJson(annotationBoilerplate);
                annotationJson.id = urljoin(canvasJson.id, 'annotation', canvasJson.items[0].items.length);
                annotationJson.motivation = Motivations.PAINTING;
                annotationJson.target = canvasJson.id;
                annotationJson.body.id = id;
                annotationJson.body.type = defaultPaintingExtension.type;
                annotationJson.body.format = defaultPaintingExtension.format;
                annotationJson.body.label = Utils.getLabel(this.infoYml.label);
                canvasJson.items[0].items.push(annotationJson);
            }
        });
    }

    private async _getInfo(): Promise<void> {
        
        this.infoYml = {};

        // if there's an info.yml
        const ymlPath: string = join(this.directoryPath, 'info.yml');

        const fileExists: boolean = await Utils.fileExists(ymlPath);

        if (fileExists) {
            this.infoYml = await Utils.readYml(ymlPath);
            console.log(chalk.green('got metadata for: ') + this.directoryPath);
        } else {
            console.log(chalk.green('no metadata found for: ') + this.directoryPath);
        }

        if (!this.infoYml.label) {
            // default to the directory name
            this.infoYml.label = basename(this.directoryPath);
        }
    }

    private _applyInfo(): void {
        this.canvasJson.label = Utils.getLabel(this.infoYml.label); // defaults to directory name

        if (this.infoYml.width) {
            this.canvasJson.width = this.infoYml.width;
        }

        if (this.infoYml.height) {
            this.canvasJson.height = this.infoYml.height;
        }

        if (this.infoYml.duration) {
            this.canvasJson.duration = this.infoYml.duration;
        }

        if (this.infoYml.metadata) {
            this.canvasJson.metadata = Utils.formatMetadata(this.infoYml.metadata);
        }
    }
}