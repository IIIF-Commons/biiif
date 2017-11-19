const { glob } = require('glob');
const { posix, dirname, extname, join } = require('path');
const { existsSync, readFileSync } = require('fs');
const chalk = require('chalk');
const config = require('../config');
const contentAnnotationBoilerplate = require('./boilerplate/contentAnnotation');
const yaml = require('js-yaml');
import { cloneJson } from './Utils';

export class Canvas {
    filePath: string;
    url: string;
    metadata: any = {};

    constructor(filePath: string, url: string) {
        this.filePath = filePath;
        this.url = url;
    }

    public getFiles(canvasJson: any): void {
        // for each jpg/pdf/mp4/obj in the canvas directory
        // add a contentannotation
        const files: string[] = glob.sync(this.filePath + '/*.*');
        const matchingFiles: string[] = [];

        files.forEach((file: string) => {
            
            const extName: string = extname(file);

            // if config.canvasAnnotationTypes has a matching extension
            const matchingExtension: any = config.canvasAnnotationTypes[extName];

            let directoryName: string = dirname(file);
            directoryName = directoryName.substr(directoryName.lastIndexOf('/')) + '/';
            const fileName: string = posix.basename(file);
            const id: string = this.url + directoryName + fileName;

            if (matchingExtension) {
                this._getMetadata();
                const annotationJson: any = cloneJson(contentAnnotationBoilerplate);
                annotationJson.id = canvasJson.id + '/annotation/' + matchingFiles.length;
                annotationJson.target = canvasJson.id;
                annotationJson.body.id = id;
                annotationJson.body.type = matchingExtension.type;
                annotationJson.body.format = matchingExtension.format;
                annotationJson.body.label = this.metadata.label;
                canvasJson.content[0].items.push(annotationJson);

                matchingFiles.push(file);
            }
        });

        if (!matchingFiles.length) {
            console.warn(chalk.yellow('Could not find any files to annotate onto ' + this.filePath));
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
            this.metadata.label = posix.basename(this.filePath);
        }
    }
}