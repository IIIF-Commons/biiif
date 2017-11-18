const { existsSync, readFileSync, writeFileSync } = require('fs');
const { glob } = require('glob');
const { join, basename } = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');
import { cloneJson } from './utils';
// boilerplate json
//const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
//const collectionMemberBoilerplate = require('./boilerplate/collectionMember');
const manifestBoilerplate = require('./boilerplate/manifest');
//const manifestMemberBoilerplate = require('./boilerplate/manifestMember');

export class BIIIF {

    public static process(dir: string, url: string): void {

        console.log(chalk.white('biiifing ' + dir));
        
        // validate inputs
    
        if (!existsSync(dir)) {
            throw new Error('Directory does not exist');
        }
    
        if (!url) {
            throw new Error('You must pass a url parameter');
        }
    
        BIIIF._processDirectory(dir, url);
    }

    private static _processDirectory(dir: string, url: string): void {
 
        // canvases are directories starting with an undersore
        const canvases: string[] = glob.sync(join(dir, '/_*'), {
            ignore: [
                '*/*.*' // ignore files
            ]
        });

        // children are directories not starting with an underscore
        // these can be child manifests or child collections
        const children: string[] = glob.sync(join(dir, '/*'), {
            ignore: [
                '*/*.*', // ignore files
                '*/_*'   // ignore canvases
            ]
        });
    
        const isCollection: boolean = children.length > 0;       

        if (isCollection && canvases.length) {
            console.warn(chalk.yellow(canvases.length + ' unused canvas directories (starting with an underscore) found in the ' + dir + ' collection. Remove directories not starting with an underscore to convert into a manifest.'));
        }
    
        // if there's an info.yml
        const ymlPath: string = join(dir, 'info.yml');
        let infoYml: any;
    
        if (existsSync(ymlPath)) {
            infoYml = yaml.safeLoad(readFileSync(ymlPath, 'utf8'));
        }
    
        // create an index.json
        let indexJson: any;
    
        if (isCollection) {
            indexJson = cloneJson(collectionBoilerplate);
        } else {
            indexJson = cloneJson(manifestBoilerplate);
        }
    
        indexJson.id = url;
    
        if (infoYml) {
    
            // if a label is set in the info.yml, use it
            if (infoYml.label) {
                indexJson.label = infoYml.label;
            } else {
                // otherwise default to the directory name
                indexJson.label = basename(dir);
            }
    
            // add manifest-specific properties
            if (!isCollection) {
    
                if (infoYml.attribution) {
                    indexJson.attribution = infoYml.attribution;
                }
    
                if (infoYml.description) {
                    indexJson.description = infoYml.description;
                }
            }
        }
    
        writeFileSync(join(dir, 'index.json'), JSON.stringify(indexJson, null, '  '));
    
        if (isCollection) {
            console.log(chalk.green('created collection: ') + join(dir, 'index.json'));
        } else {
            console.log(chalk.green('created manifest: ') + join(dir, 'index.json'));
        }
        
    }
}