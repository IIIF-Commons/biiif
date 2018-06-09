import { Directory } from './Directory';
const chalk = require('chalk');
const { existsSync } = require('fs');

export const build = async (dir: string, url: string, generateThumbs: boolean = true, virtualName?: string): Promise<void> => {
    console.log(chalk.white('started biiifing ' + dir));
    
    // validate inputs

    if (!existsSync(dir)) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    await new Directory(dir, url, generateThumbs, virtualName).read();
    
    console.log(chalk.white('finished biiifing ' + dir));
}