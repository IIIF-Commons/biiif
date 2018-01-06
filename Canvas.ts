const { existsSync, readFileSync } = require('fs');
const { glob } = require('glob');
const { basename, dirname, extname, join } = require('path');
const urljoin = require('url-join');
const chalk = require('chalk');
const config = require('./config');
const contentAnnotationBoilerplate = require('./boilerplate/contentannotation');
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

        // for each jpg/pdf/mp4/obj in the canvas directory
        // add a contentannotation
        const files: string[] = glob.sync(this.filePath + '/*.*', {
            ignore: [
                '**/thumb.*' // ignore thumbs
            ]
        });

        const matchingFiles: string[] = [];

        files.forEach((file: string) => {
            
            const extName: string = extname(file);

            // if config.canvasAnnotationTypes has a matching extension
            const matchingExtension: any = config.canvasAnnotationTypes[extName];

            let directoryName: string = dirname(file);
            directoryName = directoryName.substr(directoryName.lastIndexOf('/'));
            const fileName: string = basename(file);
            const id: string = urljoin(this.url.href, directoryName, fileName);

            if (matchingExtension) {
                const annotationJson: any = Utils.cloneJson(contentAnnotationBoilerplate);
                annotationJson.id = urljoin(canvasJson.id, 'annotation', matchingFiles.length);
                annotationJson.target = canvasJson.id;
                annotationJson.body.id = id;
                annotationJson.body.type = matchingExtension.type;
                annotationJson.body.format = matchingExtension.format;
                annotationJson.body.label = this.infoYml.label;
                canvasJson.items[0].items.push(annotationJson);

                matchingFiles.push(file);
            }
        });

        if (!matchingFiles.length) {
            console.warn(chalk.yellow('Could not find any files to annotate onto ' + this.filePath));
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

    private _applyMetadata(): void {
        this.canvasJson.label = this.infoYml.label; // defaults to directory name

        if (this.infoYml.metadata) {
            this.canvasJson.metadata = Utils.formatMetadata(this.infoYml.metadata);
        }
    }
}