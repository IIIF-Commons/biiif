const { existsSync, readFileSync, writeFileSync } = require('fs');
const { glob } = require('glob');
const { join, basename } = require('path');
const chalk = require('chalk');
const urljoin = require('url-join');
const yaml = require('js-yaml');
const { URL } = require('url');
import { Canvas } from './Canvas';
import { Utils } from './Utils';
// boilerplate json
const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
const collectionMemberBoilerplate = require('./boilerplate/collectionMember');
const manifestBoilerplate = require('./boilerplate/manifest');
const manifestMemberBoilerplate = require('./boilerplate/manifestMember');

export class Directory {
    filePath: string;
    url: URL;
    isCollection: boolean;
    canvases: Canvas[] = [];
    directories: Directory[] = [];
    infoYml: any;
    indexJson: any;

    constructor(filePath: string, url: string) {
        
        this.filePath = filePath;
        this.url = new URL(url);
        
        // canvases are directories starting with an undersore
        const canvasesPattern: string = filePath + '/_*';

        const canvases: string[] = glob.sync(canvasesPattern, {
            ignore: [
                '**/*.*' // ignore files
            ]
        });

        canvases.forEach((canvas: string)=> {
            console.log(chalk.green('creating canvas for: ') + canvas);
            this.canvases.push(new Canvas(canvas, this.url));
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
            this.directories.push(new Directory(directory, urljoin(this.url.href, basename(directory))));
        });

        this.isCollection = this.directories.length > 0;

        this._getMetadata();
        this._createIndexJson();

        if (this.isCollection) {
            console.log(chalk.green('created collection: ') + this.filePath);
            // if there are canvases, warn that they are being ignored
            if (this.canvases.length) {
                console.warn(chalk.yellow(this.canvases.length + ' unused canvas directories (starting with an underscore) found in the ' + this.filePath + ' collection. Remove directories not starting with an underscore to convert into a manifest.'));
            }
        } else {
            console.log(chalk.green('created manifest: ') + this.filePath);
            // if there aren't any canvases, warn that there should be
            if (!this.canvases.length) {
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

            // for each child directory, add a collectionmember or manifestmember json boilerplate to members.

            this.directories.forEach((directory: Directory) => {
                let memberJson: any;

                if (directory.isCollection) {
                    memberJson = Utils.cloneJson(collectionMemberBoilerplate);
                } else {
                    memberJson = Utils.cloneJson(manifestMemberBoilerplate);
                }

                memberJson.id = urljoin(directory.url.href, 'index.json');
                memberJson.label = directory.infoYml.label;

                this.indexJson.members.push(memberJson); 
            });

        } else {
            this.indexJson = Utils.cloneJson(manifestBoilerplate);

            // for each canvas, add canvas json

            this.canvases.forEach((canvas: Canvas, index: number) => {
                const canvasJson: any = Utils.cloneJson(canvasBoilerplate);

                canvasJson.id = urljoin(this.url.href, 'index.json/canvas', index);
                canvasJson.content[0].id = urljoin(this.url.href, 'index.json/canvas', index, 'annotationpage/0');

                canvas.create(canvasJson);

                // add canvas to sequence
                this.indexJson.sequences[0].canvases.push(canvasJson);
            });
        }
    
        this.indexJson.id = urljoin(this.url.href, 'index.json');

        this._applyMetadata();

        Utils.getThumbnail(this.indexJson, this.url, this.filePath);

        // write index.json
        writeFileSync(join(this.filePath, 'index.json'), JSON.stringify(this.indexJson, null, '  '));

        console.log(chalk.green('created index.json for: ') + this.filePath);
    }

    private _applyMetadata(): void {

        this.indexJson.label = this.infoYml.label; // defaults to directory name

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