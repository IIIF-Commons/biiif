const { existsSync, readFileSync, writeFileSync } = require('fs');
const { glob } = require('glob');
const { join, basename } = require('path');
const { URL } = require('url');
const chalk = require('chalk');
const urljoin = require('url-join');
const yaml = require('js-yaml');
import { Canvas } from './Canvas';
import { Utils } from './Utils';
// boilerplate json
const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
const collectionItemBoilerplate = require('./boilerplate/collectionitem');
const manifestBoilerplate = require('./boilerplate/manifest');
const manifestItemBoilerplate = require('./boilerplate/manifestitem');
const thumbnailBoilerplate = require('./boilerplate/thumbnail');

export class Directory {
    directories: Directory[] = [];
    filePath: string;
    indexJson: any;
    infoYml: any;
    isCollection: boolean;
    items: Canvas[] = [];
    parentDirectory: Directory | undefined;
    url: URL;
    virtualName: string | undefined; // used when root directories are dat/ipfs ids

    constructor(filePath: string, url: string, virtualName?: string, parentDirectory?: Directory) {
    
        this.filePath = filePath;
        this.url = new URL(url);
        this.parentDirectory = parentDirectory;
        this.virtualName = virtualName;
        
        // canvases are directories starting with an underscore
        const canvasesPattern: string = filePath + '/_*';

        const canvases: string[] = glob.sync(canvasesPattern, {
            ignore: [
                '**/*.*' // ignore files
            ]
        });

        canvases.forEach((canvas: string) => {
            console.log(chalk.green('creating canvas for: ') + canvas);
            this.items.push(new Canvas(canvas, this));
        });

        // directories not starting with an underscore
        // these can be child manifests or child collections
        const directoriesPattern: string = filePath + '/*';

        const directories: string[] = glob.sync(directoriesPattern, {
            ignore: [
                '**/*.*', // ignore files
                '**/_*'   // ignore canvases
            ]
        });

        directories.forEach((directory: string) => {
            console.log(chalk.green('creating directory for: ') + directory);
            const name: string = basename(directory);
            const url: string = urljoin(this.url.href, name);
            this.directories.push(new Directory(directory, url, undefined, this));
        });

        this.isCollection = this.directories.length > 0 || Utils.hasManifestsYML(this.filePath);

        this._getMetadata();
        this._createIndexJson();

        if (this.isCollection) {
            console.log(chalk.green('created collection: ') + this.filePath);
            // if there are canvases, warn that they are being ignored
            if (this.items.length) {
                console.warn(chalk.yellow(this.items.length + ' unused canvas directories (starting with an underscore) found in the ' + this.filePath + ' collection. Remove directories not starting with an underscore to convert into a manifest.'));
            }
        } else {
            console.log(chalk.green('created manifest: ') + this.filePath);
            // if there aren't any canvases, warn that there should be
            if (!this.items.length) {
                console.warn(chalk.yellow(this.filePath + ' is a manifest, but no canvases (directories starting with an underscore) were found. Therefore it will not have any content.'));
            }
        }
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

    private _createIndexJson(): void {

        if (this.isCollection) {
            this.indexJson = Utils.cloneJson(collectionBoilerplate);

            // for each child directory, add a collectionitem or manifestitem json boilerplate to items.

            this.directories.forEach((directory: Directory) => {
                let itemJson: any;

                if (directory.isCollection) {
                    itemJson = Utils.cloneJson(collectionItemBoilerplate);
                } else {
                    itemJson = Utils.cloneJson(manifestItemBoilerplate);
                }

                itemJson.id = urljoin(directory.url.href, 'index.json');
                itemJson.label = Utils.getLabel(directory.infoYml.label);

                Utils.getThumbnail(itemJson, directory);

                this.indexJson.items.push(itemJson); 
            });

            // check for manifests.yml. if it exists, parse and add to items
            if (Utils.hasManifestsYML(this.filePath)) {

                const manifestsPath: string = join(this.filePath, 'manifests.yml');
                const manifestsYml: any = yaml.safeLoad(readFileSync(manifestsPath, 'utf8'));

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

                console.log(chalk.green('parsed manifests.yml for: ') + this.filePath);         
            } else {
                console.log(chalk.green('no manifests.yml found for: ') + this.filePath);
            }

            // sort items              
            this.indexJson.items.sort((a, b) => {
                if (a.label['@none'][0].toLowerCase() < b.label['@none'][0].toLowerCase()) return -1;
                if (a.label['@none'][0].toLowerCase() > b.label['@none'][0].toLowerCase()) return 1;
                return 0;
            });

        } else {
            this.indexJson = Utils.cloneJson(manifestBoilerplate);

            // for each canvas, add canvas json

            this.items.forEach((canvas: Canvas, index: number) => {
                const canvasJson: any = Utils.cloneJson(canvasBoilerplate);

                canvasJson.id = urljoin(this.url.href, 'index.json/canvas', index);
                canvasJson.items[0].id = urljoin(this.url.href, 'index.json/canvas', index, 'annotationpage/0');

                canvas.create(canvasJson);

                // add canvas to items
                this.indexJson.items.push(canvasJson);
            });
        }
    
        this.indexJson.id = urljoin(this.url.href, 'index.json');

        this._applyMetadata();

        Utils.getThumbnail(this.indexJson, this);

        // write index.json
        writeFileSync(join(this.filePath, 'index.json'), JSON.stringify(this.indexJson, null, '  '));

        console.log(chalk.green('created index.json for: ') + this.filePath);
    }

    private _applyMetadata(): void {

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