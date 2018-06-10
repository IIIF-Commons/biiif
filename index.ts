//import { Directory } from './Directory';
const chalk = require('chalk');
//const { existsSync } = require('fs');
import { Utils } from './Utils';

export const build = async (dir: string, url: string, generateThumbs: boolean = true, virtualName?: string): Promise<void> => {
    
    console.log(chalk.white('started biiifing ' + dir));
    
    // validate inputs

    const exists: boolean = await Utils.fileExists(dir);
    
    if (!exists) {
        throw new Error('Directory does not exist');
    }

    if (!url) {
        throw new Error('You must pass a url parameter');
    }

    await Utils.timeout(500).then(() => {
        console.log('timeout complete');
    });

    // new Directory(dir, url, generateThumbs, virtualName).read().then(() => {
    //     console.log(chalk.white('finished biiifing ' + dir));
    //     resolve();
    // });

    console.log(chalk.white('finished biiifing ' + dir));
}