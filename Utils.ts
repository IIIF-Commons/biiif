const { promisify } = require('util');
const fs = require('fs');
const stat = promisify(fs.stat);
const { dirname } = require('path');
const { join, basename } = require('path');
const chalk = require('chalk');
const config = require('./config');
const Jimp = require("jimp");
const labelBoilerplate = require('./boilerplate/label');
const thumbnailBoilerplate = require('./boilerplate/thumbnail');
const urljoin = require('url-join');
import { Directory } from "./Directory";
import { Motivations } from "./Motivations";
import { promise as glob } from 'glob-promise';
import { TypeFormat } from "./TypeFormat";
import { Types } from "./Types";

export class Utils {

    public static getTypeByExtension(motivation: string, extension: string): string | undefined {
        const m: any = config.annotation.motivations[motivation];

        if (m) {
            if (m[extension] && m[extension].length) {
                return m[extension][0].type;
            }
        }

        return undefined;
    }

    public static getFormatByExtension(motivation: string, extension: string): string | undefined {
        const m: any = config.annotation.motivations[motivation];

        if (m) {
            if (m[extension] && m[extension].length) {
                return m[extension][0].format;
            }
        }

        return undefined;
    }

    public static getFormatByExtensionAndType(motivation: string, extension: string, type: string): string | undefined {
        const m: any = config.annotation.motivations[motivation];

        if (m) {
            if (m[extension] && m[extension].length) {
                const typeformats: TypeFormat[] = m[extension];
                for (let i = 0; i < typeformats.length; i++) {
                    const typeformat: TypeFormat = typeformats[i];
                    if (typeformat.type === type) {
                        return typeformat.format;
                    }
                }
            }
        }

        return undefined;
    }

    public static getTypeByFormat(motivation: string, format: string): string | undefined {
        const m: any = config.annotation.motivations[motivation];

        if (m) {
            for (const extension in m) {
                const typeformats: TypeFormat[] = m[extension];
                for (let i = 0; i < typeformats.length; i++) {
                    const typeformat: TypeFormat = typeformats[i];
                    if (typeformat.format === format) {
                        return typeformat.type;
                    }
                }
            }
        }

        return undefined;
    }

    public static getFormatByType(motivation: string, type: string): string | undefined {
        const m: any = config.annotation.motivations[motivation];

        // only able to categorically say there's a matching format 
        // if there's a single extension with a single type

        if (m) {
            if (Object.keys(m).length === 1) {
                const typeformats: TypeFormat[] = m[Object.keys(m)[0]];

                if (typeformats.length === 1) {
                    return typeformats[0].format;
                }
            }
        }

        return undefined;
    }

    public static timeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static cloneJson (json: any): any {
        return JSON.parse(JSON.stringify(json));
    }

    public static formatMetadata(metadata: any): any {

        const formattedMetadata: any[] = [];

        for (let key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                const value: string = metadata[key];

                const item: any = {};

                item.label = Utils.getLabel(key);
                item.value = Utils.getLabel(value);

                formattedMetadata.push(item);
            }
        }

        return formattedMetadata;
    }

    public static async hasManifestsYML(filePath: string): Promise<boolean> {
        const manifestsPath: string = join(filePath, 'manifests.yml');
        try {
            await stat(manifestsPath);
            return true;
        } catch {
            return false;
        }
    }

    // If filePath is:
    // C://Users/edsilv/github/edsilv/biiif-workshop/collection/_abyssinian/thumb.jpeg
    // and 'collection' has been replaced by the top-level virtual name 'virtualname'
    // it should return:
    // C://Users/edsilv/github/edsilv/biiif-workshop/virtualname/_abyssinian/thumb.jpeg
    // virtual names are needed when using dat or ipfs ids as the root directory.
    public static getVirtualFilePath(filePath: string, directory: Directory): string {

        // walk up directory parents building the realPath and virtualPath array as we go.
        // at the top level directory, use the real name for realPath and the virtual name for virtualPath.
        // reverse the arrays and join with a '/'.
        // replace the realPath section of filePath with virtualPath.

        let realPath: string[] = [basename(filePath)];
        let virtualPath: string[] = [basename(filePath)];

        while(directory) {
            const realName: string = basename(directory.filePath);
            const virtualName: string = directory.virtualName || realName;
            realPath.push(realName);
            virtualPath.push(virtualName);
            directory = directory.parentDirectory;
        }

        realPath = realPath.reverse();
        virtualPath = virtualPath.reverse();

        const realPathString: string = realPath.join('/');
        const virtualPathString: string = virtualPath.join('/');

        filePath = Utils.normaliseFilePath(filePath);
        filePath = filePath.replace(realPathString, virtualPathString);

        return filePath;
    }

    public static async getThumbnail(json: any, directory: Directory, filePath?: string): Promise<void> {
        const fp: string = filePath || directory.filePath;
        const thumbnailPattern: string = fp + '/thumb.*';
        const thumbnails: string[] = await glob(thumbnailPattern);

        if (thumbnails.length) {
            console.log(chalk.green('found thumbnail for: ') + fp);
            let thumbnail: string = thumbnails[0];
            const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
            thumbnailJson[0].id = Utils.mergePaths(directory.url, Utils.getVirtualFilePath(thumbnail, directory));
            json.thumbnail = thumbnailJson;
        } else if (directory.generateThumbs) {
            // if debugging: jimp item.getitem is not a function
            // generate thumbnail
            if (json.items && json.items.length && json.items[0].items) {
                console.log(chalk.green('generating thumbnail for: ') + fp);
                // find an annotation with a painting motivation of type image.
                const items =  json.items[0].items;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const body = item.body;
                    if (body && item.motivation === Motivations.PAINTING) {
                        if (body.type.toLowerCase() === Types.IMAGE) {
                            const imageName = body.id.substr(body.id.lastIndexOf('/'));
                            const imagePath = join(fp, imageName);
                            const image = await Jimp.read(imagePath);
                            const thumb = image.clone();
                            // write image buffer to disk for testing
                            // image.getBuffer(Jimp.AUTO, (err, buffer) => {
                            //     const arrBuffer = [...buffer];
                            //     const pathToBuffer: string = imagePath.substr(0, imagePath.lastIndexOf('/')) + '/buffer.txt';
                            //     fs.writeFile(pathToBuffer, arrBuffer);
                            // });
                            thumb.cover(config.thumbnails.width, config.thumbnails.height);
                            const pathToThumb = join(dirname(imagePath), 'thumb.' + image.getExtension());
                            thumb.write(pathToThumb, () => {
                                console.log(chalk.green('generated thumbnail for: ') + fp);
                            });
                            const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
                            thumbnailJson[0].id = Utils.mergePaths(directory.url, Utils.getVirtualFilePath(pathToThumb, directory));
                            json.thumbnail = thumbnailJson;

                        }
                    }
                }
            }
        }
    }

    public static getLabel(value: string): any {
        const labelJson: any = Utils.cloneJson(labelBoilerplate);
        labelJson['@none'].push(value);
        return labelJson;
    }

    /*
        merge these two example paths:
        url:        http://test.com/collection/manifest
        filePath:   c:/user/documents/collection/manifest/_canvas/thumb.png

        into:       http://test.com/collection/manifest/_canvas/thumb.png
    */
    public static mergePaths(url: URL, filePath: string): string {

        // split the url (minus origin) and filePath into arrays
        //                            ['collection', 'manifest']
        // ['c:', 'user', 'documents', 'collection', 'manifest', '_canvas', 'thumb.jpg']
        // walk backwards through the filePath array adding to the newPath array until the last item of the url array is found.
        // then while the next url item matches the next filePath item, add it to newPath.
        // the final path is the url origin plus a reversed newPath joined with a '/'
        
        let origin = url.origin;

        if (url.protocol === 'dat:') {
            origin = 'dat://';
        }

        const urlParts = Utils.getUrlParts(url);

        filePath = Utils.normaliseFilePath(filePath);
        const fileParts: string[] = filePath.split('/');
        const newPath: string[] = [];

        for (let f = fileParts.length - 1; f >= 0; f--) {
            const filePart: string = fileParts[f];
            newPath.push(filePart);
            
            if (filePart === urlParts[urlParts.length - 1]) {
                if (urlParts.length > 1) {
                    for (let u = urlParts.length - 2; u >= 0; u--) {
                        f--;
                        if (fileParts[f] === urlParts[u]) {
                            newPath.push(fileParts[f]);
                        } else {
                            newPath.push(urlParts[u]);
                        }
                    }
                }
                break;
            }
        }

        let id: string = urljoin(origin, ...newPath.reverse());

        return id;
    }

    public static normaliseFilePath(filePath: string): string {
        return filePath.replace(/\\/g, '/').replace(/\/\//g, '/');
    }

    public static getUrlParts(url: URL): string[] {
        let origin: string = url.origin;
        let urlParts: string[];

        if (url.protocol === 'dat:') {
            origin = 'dat://';
            urlParts = url.href.replace(origin, '').split('/');
        } else {
            urlParts = url.href.replace(origin + '/', '').split('/');
        }

        return urlParts;
    }
}