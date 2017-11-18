//import { timeout } from './utils';
const { lstatSync, writeFile } = require('fs');
const { join } = require('path');
const { glob } = require('glob');

export const biiif = async (dir: string, url: string) => {

    // validate inputs

    console.log(dir);
    
    if (!lstatSync(dir).isDirectory()) {
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
    // if there are child directories that don't start with an underscore, it's a manifest.
    glob("*", {
        ignore: [
            "**/_*/**"  // Exclude directories starting with '_'.
        ]
    }, (er, files) => {

        if(er) {
            throw er;
        }

        if (files) {
            isCollection = true;
        }

    });

    console.log(dir + " is collection? " + isCollection);

    // create an index.json

    writeFile(join(dir, 'index.json'), url, function(er) {
        
        if(er) {
            throw er;
        }
    
        console.log("created " + dir + "/index.json");
    });

}