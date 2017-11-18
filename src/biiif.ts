import { cloneJson } from './utils';
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join, basename } = require('path');
const { glob } = require('glob');
const yaml = require('js-yaml');
// boilerplate json
//const canvasBoilerplate = require('./boilerplate/canvas');
const collectionBoilerplate = require('./boilerplate/collection');
//const collectionMemberBoilerplate = require('./boilerplate/collectionMember');
const manifestBoilerplate = require('./boilerplate/manifest');
//const manifestMemberBoilerplate = require('./boilerplate/manifestMember');

export class BIIIF {

    public static process(dir: string, url: string): void {

        console.log('biiifing ' + dir);
        
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
        
        let isCollection: boolean = false;
    
        // is it a collection or a manifest?
        // if there are child directories that don't start with an underscore, it's a collection.
        const files: string[] = glob.sync(join(dir, '/*'), {
            ignore: [
                '*/*.*', // ignore files
                '*/_*'   // ignore anything starting with an unders0core
            ]
        });
    
        isCollection = files.length > 0;
    
        console.log(dir + ' is collection? ' + isCollection);
    
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
    
        console.log('created ' + join(dir, 'index.json'));
    }
}