const { glob } = require('glob');
const { join, basename } = require('path');
const chalk = require('chalk');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const yaml = require('js-yaml');
import { cloneJson } from './Utils';
// boilerplate json
//const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
const collectionMemberBoilerplate = require('./boilerplate/collectionMember');
const manifestBoilerplate = require('./boilerplate/manifest');
const manifestMemberBoilerplate = require('./boilerplate/manifestMember');

export class BIIIFDirectory {
    filePath: string;
    url: string;
    isCollection: boolean;
    canvases: string[] = [];
    directories: BIIIFDirectory[] = [];
    metadata: any;
    indexJson: any;

    constructor(filePath: string, url: string) {
        
        this.filePath = filePath;
        this.url = url;
        
        // canvases are directories starting with an undersore
        const canvasesPattern: string = filePath + '/_*';

        this.canvases = glob.sync(canvasesPattern, {
            ignore: [
                '**/*.*' // ignore files
            ]
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
            this.directories.push(new BIIIFDirectory(directory, this.url + '/' + basename(directory))); 
        });

        this.isCollection = this.directories.length > 0;

        this._getMetadata();
        this._createIndexJson();

        if (this.isCollection && this.canvases.length) {
            console.warn(chalk.yellow(this.canvases.length + ' unused canvas directories (starting with an underscore) found in the ' + this.filePath + ' collection. Remove directories not starting with an underscore to convert into a manifest.'));
        }

        if (this.isCollection) {
            console.log(chalk.green('created collection: ') + this.filePath);
        } else {
            console.log(chalk.green('created manifest: ') + this.filePath);
        }
    }

    private _getMetadata(): any {

        this.metadata = {};

        // if there's an info.yml
        const ymlPath: string = join(this.filePath, 'info.yml');

        if (existsSync(ymlPath)) {
            this.metadata = yaml.safeLoad(readFileSync(ymlPath, 'utf8'));
            console.log(chalk.green('got metadata for: ') + this.filePath);         
        } else {
            console.log(chalk.green('no metadata found for: ') + this.filePath);
        }

        if (!this.metadata.label) {
            // default to the directory name
            this.metadata.label = basename(this.filePath);
        }
    }

    private _createIndexJson(): void {

        if (this.isCollection) {
            this.indexJson = cloneJson(collectionBoilerplate);

            // for each child directory, add a collectionmember or manifestmember json boilerplate to members.

            this.directories.forEach((directory: BIIIFDirectory) => {
                let memberJson: any;

                if (directory.isCollection) {
                    memberJson = cloneJson(collectionMemberBoilerplate);
                } else {
                    memberJson = cloneJson(manifestMemberBoilerplate);
                }

                memberJson.id = directory.url;
                memberJson.label = directory.metadata.label;

                this.indexJson.members.push(memberJson); 
            });

        } else {
            this.indexJson = cloneJson(manifestBoilerplate);

            // for each canvas, add a canvas
        }
    
        this.indexJson.id = this.url + '/index.json';

        this._applyMetadata();

        // write index.json
        writeFileSync(join(this.filePath, 'index.json'), JSON.stringify(this.indexJson, null, '  '));

        console.log(chalk.green('created infoJson for: ') + this.filePath);
    }
        

    private _applyMetadata(): void {

        this.indexJson.label = this.metadata.label;

        // add manifest-specific properties
        if (!this.isCollection) {

            if (this.metadata.attribution) {
                this.indexJson.attribution = this.metadata.attribution;
            }

            if (this.metadata.description) {
                this.indexJson.description = this.metadata.description;
            }
        }
    }
}