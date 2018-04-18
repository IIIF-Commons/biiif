const { existsSync, readFileSync } = require('fs');
const { glob } = require('glob');
const { basename, dirname, extname, join } = require('path');
const urljoin = require('url-join');
const chalk = require('chalk');
const config = require('./config');
const annotationBoilerplate = require('./boilerplate/annotation');
const yaml = require('js-yaml');
import { Utils } from './Utils';

export class Canvas {
    canvasJson: any;
    filePath: string;
    infoYml: any = {};
    url: URL;

    constructor(filePath: string, url: URL) {
        this.filePath = filePath;
        this.url = url;
    }

    public create(canvasJson: any): void {

        this.canvasJson = canvasJson;
        this._getMetadata();
        this._applyMetadata();

        Utils.getThumbnail(this.canvasJson, this.url, this.filePath);

        // first, determine if there are any custom annotations (files ending in .yml that aren't info.yml)
        // if there are, loop through them creating the custom annotations.
        // if none of them were painting.yml, loop through all paintable file types adding to canvas.

        // const customAnnotationFiles: string[] = glob.sync(this.filePath + '/*.yml', {
        //     ignore: [
        //         '**/info.yml'
        //     ]
        // });

        // customAnnotationFiles.forEach((file: string) => {

        //     let directoryName: string = dirname(file);
        //     directoryName = directoryName.substr(directoryName.lastIndexOf('/'));
        //     const fileName: string = basename(file);
        //     const motivation: string = basename(file, extname(file));
        //     const id: string = urljoin(this.url.href, directoryName, motivation);

        //     const annotationJson: any = Utils.cloneJson(annotationBoilerplate);
        //     annotationJson.id = urljoin(canvasJson.id, 'annotation', canvasJson.items[0].items.length);
        //     annotationJson.target = canvasJson.id;
        //     annotationJson.body.id = id;
        //     annotationJson.body.type = defaultPaintingExtension.type;
        //     annotationJson.body.format = defaultPaintingExtension.format;
        //     annotationJson.body.label = Utils.getLabel(this.infoYml.label);
        //     canvasJson.items[0].items.push(annotationJson);
        // });

        this._annotatePaintableFiles(canvasJson);

        if (!canvasJson.items[0].items.length) {
            console.warn(chalk.yellow('Could not find any files to annotate onto ' + this.filePath));
        }
    }

    private _annotatePaintableFiles(canvasJson: any): void {
        // for each jpg/pdf/mp4/obj in the canvas directory
        // add a painting annotation
        const paintableFiles: string[] = glob.sync(this.filePath + '/*.*', {
            ignore: [
                '**/thumb.*' // ignore thumbs
            ]
        });

        paintableFiles.forEach((file: string) => {

            const extName: string = extname(file);

            // if config.annotation.types.painting has a matching extension
            const defaultPaintingExtension: any = config.annotation.types.painting[extName];

            let directoryName: string = dirname(file);
            directoryName = directoryName.substr(directoryName.lastIndexOf('/'));
            const fileName: string = basename(file);
            const id: string = urljoin(this.url.href, directoryName, fileName);

            if (defaultPaintingExtension) {
                const annotationJson: any = Utils.cloneJson(annotationBoilerplate);
                annotationJson.id = urljoin(canvasJson.id, 'annotation', canvasJson.items[0].items.length);
                annotationJson.motivation = "painting";
                annotationJson.target = canvasJson.id;
                annotationJson.body.id = id;
                annotationJson.body.type = defaultPaintingExtension.type;
                annotationJson.body.format = defaultPaintingExtension.format;
                annotationJson.body.label = Utils.getLabel(this.infoYml.label);
                canvasJson.items[0].items.push(annotationJson);
            }
        });
    }

    private _getMetadata(): any {
        
        this.infoYml = {};

        // if there's an info.yml
        const ymlPath: string = join(this.filePath, 'info.yml');

        if (existsSync(ymlPath)) {
            this.infoYml = yaml.safeLoad(readFileSync(ymlPath, 'utf8'));
            console.log(chalk.green('got metadata for: ') + this.filePath);         
        } else {
            console.log(chalk.green('no metadata found for: ') + this.filePath);
        }

        if (!this.infoYml.label) {
            // default to the directory name
            this.infoYml.label = basename(this.filePath);
        }
    }

    private _applyMetadata(): void {
        this.canvasJson.label = Utils.getLabel(this.infoYml.label); // defaults to directory name

        if (this.infoYml.metadata) {
            this.canvasJson.metadata = Utils.formatMetadata(this.infoYml.metadata);
        }
    }
}