import { Directory } from './Directory';
const chalk = require('chalk');
import { Utils } from './Utils';

export const build = async (dir: string, url: string, generateThumbs: boolean = false, virtualName?: string): Promise<void> => {
    
    console.log(chalk.white('started biiifing ' + dir));
    
    // validate inputs

    const exists: boolean = await Utils.fileExists(dir);
    
    if (!exists) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    const directory: Directory = new Directory(dir, url, generateThumbs, virtualName);

    await directory.read();

    console.log(chalk.white('finished biiifing ' + dir));
}