import { BIIIFDirectory } from './BIIIFDirectory';
const chalk = require('chalk');
const { existsSync } = require('fs');

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
    
        new BIIIFDirectory(dir, url);
    }
}