//import { timeout } from './utils';
const { existsSync, writeFile } = require('fs');
const { join } = require('path');
const { glob } = require('glob');

export const biiif = async (dir: string, url: string) => {

    console.log('biiifing ' + dir);

    // validate inputs

    if (!existsSync(dir)) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    processDirectory(dir, url);
}

export const processDirectory = async (dir: string, url: string) => {

    let isCollection: boolean = false;

    // is it a collection or a manifest?
    // if there are child directories that don't start with an underscore, it's a collection.
    const files: string[] = glob.sync(join(dir, "/*"), {
        ignore: [
            "*/*.*", // ignore files
            "*/_*"   // ignore anything starting with an underscore
        ]
    });

    isCollection = files.length > 0;

    //console.log(files);

    console.log(dir + " is collection? " + isCollection);

    // create an index.json

    writeFile(join(dir, 'index.json'), url, function(er) {
        
        if(er) {
            throw er;
        }
    
        console.log("created " + dir + "/index.json");
    });

}