const { join, basename } = require('path');
const { URL } = require('url');
const chalk = require('chalk');
const urljoin = require('url-join');
import { Canvas } from './Canvas';
import { promise as glob } from 'glob-promise';
import { Utils } from './Utils';
// boilerplate json
const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
const collectionItemBoilerplate = require('./boilerplate/collectionitem');
const manifestBoilerplate = require('./boilerplate/manifest');
const manifestItemBoilerplate = require('./boilerplate/manifestitem');
const thumbnailBoilerplate = require('./boilerplate/thumbnail');

export class Directory {

    public directories: Directory[] = [];
    public directoryPath: string;
    public generateThumbs: boolean;
    public indexJson: any;
    public infoYml: any;
    public isCollection: boolean;
    public items: Canvas[] = [];
    public parentDirectory: Directory | undefined;
    public url: URL;
    public virtualName: string | undefined; // used when root directories are dat/ipfs ids

    constructor(directoryPath: string, url: string, generateThumbs: boolean = false, virtualName?: string, parentDirectory?: Directory) {
    
        this.directoryPath = directoryPath;
        this.generateThumbs = generateThumbs;
        this.url = new URL(url);
        this.parentDirectory = parentDirectory;
        this.virtualName = virtualName;

    }

    public async read(): Promise<void> {

        // canvases are directories starting with an underscore
        const canvasesPattern: string = this.directoryPath + '/_*';

        const canvases: string[] = await glob(canvasesPattern, {
            ignore: [
                '**/*.yml',
                '**/thumb.*'
            ]
        });

        await Promise.all(canvases.map(async (canvas: string) => {
            console.log(chalk.green('creating canvas for: ') + canvas);
            this.items.push(new Canvas(canvas, this));
        }));

        // directories not starting with an underscore
        // these can be child manifests or child collections
        const directoriesPattern: string = this.directoryPath + '/*';

        const directories: string[] = await glob(directoriesPattern, {
            ignore: [
                '**/*.*', // ignore files
                '**/_*'   // ignore canvas folders
            ]
        });

        await Promise.all(directories.map(async (directory: string) => {
            console.log(chalk.green('creating directory for: ') + directory);
            const name: string = basename(directory);
            const url: string = urljoin(this.url.href, name);
            const newDirectory: Directory = new Directory(directory, url, this.generateThumbs, undefined, this);
            await newDirectory.read();
            this.directories.push(newDirectory);
        }));

        // if there are no canvas, manifest, or collection directories to read,
        // but there are paintable files in the current directory,
        // create a canvas for each.
        if (!this.directories.length && !canvases.length) {

            const paintableFiles: string[] = await glob(this.directoryPath + '/*.*', {
                ignore: [
                    '**/*.yml',
                    '**/thumb.*',
                    '**/index.json'
                ]
            });

            paintableFiles.forEach((file: string) => {
                console.log(chalk.green('creating canvas for: ') + file);
                this.items.push(new Canvas(file, this));
            });

        }

        this.isCollection = this.directories.length > 0 || await Utils.hasManifestsYml(this.directoryPath);

        await this._getInfo();
        await this._createIndexJson();       

        if (this.isCollection) {
            console.log(chalk.green('created collection: ') + this.directoryPath);
            // if there are canvases, warn that they are being ignored
            if (this.items.length) {
                console.warn(chalk.yellow(this.items.length + ' unused canvas directories (starting with an underscore) found in the ' + this.directoryPath + ' collection. Remove directories not starting with an underscore to convert into a manifest.'));
            }
        } else {
            console.log(chalk.green('created manifest: ') + this.directoryPath);
            // if there aren't any canvases, warn that there should be
            if (!this.items.length) {
                console.warn(chalk.yellow(this.directoryPath + ' is a manifest, but no canvases (directories starting with an underscore) were found. Therefore it will not have any content.'));
            }
        }

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

    private async _createIndexJson(): Promise<void> {

        if (this.isCollection) {
            this.indexJson = Utils.cloneJson(collectionBoilerplate);

            // for each child directory, add a collectionitem or manifestitem json boilerplate to items.

            await Promise.all(this.directories.map(async (directory: Directory) => {
                let itemJson: any;

                if (directory.isCollection) {
                    itemJson = Utils.cloneJson(collectionItemBoilerplate);
                } else {
                    itemJson = Utils.cloneJson(manifestItemBoilerplate);
                }

                itemJson.id = urljoin(directory.url.href, 'index.json');
                itemJson.label = Utils.getLabel(directory.infoYml.label);

                await Utils.getThumbnail(itemJson, directory);

                this.indexJson.items.push(itemJson); 
            }));

            // check for manifests.yml. if it exists, parse and add to items
            const hasManifestsYml: boolean = await Utils.hasManifestsYml(this.directoryPath);

            if (hasManifestsYml) {

                const manifestsPath: string = join(this.directoryPath, 'manifests.yml');
                const manifestsYml: any = await Utils.readYml(manifestsPath);

                manifestsYml.manifests.forEach((manifest: any) => {
                    const itemJson: any = Utils.cloneJson(collectionItemBoilerplate);
                    itemJson.id = manifest.id;
                    
                    if (manifest.label) {
                        itemJson.label = Utils.getLabel(manifest.label);
                    } else {
                        // no label supplied, use the last fragment of the url
                        const url: URL = new URL(itemJson.id);
                        const pathname: string[] = url.pathname.split('/');

                        if (pathname.length > 1) {
                            itemJson.label = Utils.getLabel(pathname[pathname.length - 2]);
                        }
                    }

                    if (manifest.thumbnail) {
                        if (typeof manifest.thumbnail === 'string') {
                            const thumbnail: any[] = Utils.cloneJson(thumbnailBoilerplate);
                            thumbnail[0].id = manifest.thumbnail;
                            itemJson.thumbnail = thumbnail;
                        } else {
                            itemJson.thumbnail = manifest.thumbnail;
                        }
                    }

                    this.indexJson.items.push(itemJson);
                });

                console.log(chalk.green('parsed manifests.yml for: ') + this.directoryPath);         
            } else {
                console.log(chalk.green('no manifests.yml found for: ') + this.directoryPath);
            }

            // sort items 
            const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

            this.indexJson.items.sort((a, b) => {
                return collator.compare(a.label['@none'][0].toLowerCase(), b.label['@none'][0].toLowerCase());
            });

        } else {

            this.indexJson = Utils.cloneJson(manifestBoilerplate);

            // for each canvas, add canvas json

            await Promise.all(this.items.map(async (canvas: Canvas, index: number) => {
                const canvasJson: any = Utils.cloneJson(canvasBoilerplate);

                canvasJson.id = urljoin(this.url.href, 'index.json/canvas', index);
                canvasJson.items[0].id = urljoin(this.url.href, 'index.json/canvas', index, 'annotationpage/0');

                await canvas.read(canvasJson);

                // add canvas to items
                this.indexJson.items.push(canvasJson);
            }));

            const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

            this.indexJson.items.sort((a, b) => {
                return collator.compare(a.id, b.id);
            });
        }

        this.indexJson.id = urljoin(this.url.href, 'index.json');

        this._applyInfo();

        await Utils.getThumbnail(this.indexJson, this);

        // write index.json
        const path: string = join(this.directoryPath, 'index.json');
        const json: string = JSON.stringify(this.indexJson, null, '  ');

        console.log(chalk.green('creating index.json for: ') + this.directoryPath);

        await Utils.writeJson(path, json);
    }

    private _applyInfo(): void {

        this.indexJson.label = Utils.getLabel(this.infoYml.label); // defaults to directory name

        if (this.infoYml.metadata) {
            this.indexJson.metadata = Utils.formatMetadata(this.infoYml.metadata);
        }

        // add manifest-specific properties
        if (!this.isCollection) {

            if (this.infoYml.attribution) {
                this.indexJson.attribution = this.infoYml.attribution;
            }

            if (this.infoYml.description) {
                this.indexJson.description = this.infoYml.description;
            }
        }
    }
}