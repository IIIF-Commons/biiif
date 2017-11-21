import { Directory } from './Directory';
const chalk = require('chalk');
const { existsSync } = require('fs');

const biiif = (dir: string, url: string) => {

    console.log(chalk.white('biiifing ' + dir));
    
    // validate inputs

    if (!existsSync(dir)) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    new Directory(dir, url);

    console.log("Done!");
}

module.exports = biiif;