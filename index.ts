import { Directory } from './Directory';
const chalk = require('chalk');
const { existsSync } = require('fs');

export const build = (dir: string, url: string, name?: string): void => {
    console.log(chalk.white('started biiifing ' + dir));
    
    // validate inputs

    if (!existsSync(dir)) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    new Directory(dir, url, name);

    console.log(chalk.white('finished biiifing ' + dir));
}