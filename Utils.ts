// const fs = require('fs');
const { dirname } = require('path');
const { existsSync } = require('fs');
const { glob } = require('glob');
const { join } = require('path');
const chalk = require('chalk');
const config = require('./config');
const Jimp = require("jimp");
const labelBoilerplate = require('./boilerplate/label');
const thumbnailBoilerplate = require('./boilerplate/thumbnail');
const urljoin = require('url-join');
import { Motivations } from "./Motivations";
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

    public static hasManifestsYML(filePath: string): boolean {
        const manifestsPath: string = join(filePath, 'manifests.yml');
        return existsSync(manifestsPath);
    }

    public static getThumbnail(json: any, url: URL, filePath: string): any {
        const thumbnailPattern: string = filePath + '/thumb.*';
        const thumbnails: string[] = glob.sync(thumbnailPattern);

        if (thumbnails.length) {
            console.log(chalk.green('found thumbnail for: ') + filePath);
            let thumbnail: string = thumbnails[0];
            const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
            thumbnailJson[0].id = Utils.mergePaths(url, thumbnail);
            json.thumbnail = thumbnailJson;
        } else {
            // generate thumbnail
            if (json.items && json.items.length && json.items[0].items) {
                console.log(chalk.green('generating thumbnail for: ') + filePath);
                // find an annotation with a painting motivation of type image.
                const items =  json.items[0].items;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const body = item.body;
                    if (body && item.motivation === Motivations.PAINTING) {
                        if (body.type.toLowerCase() === Types.IMAGE) {
                            const imageName = body.id.substr(body.id.lastIndexOf('/'));
                            const imagePath = join(filePath, imageName);
                            Jimp.read(imagePath).then((image) => {
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
                                    console.log(chalk.green('generated thumbnail for: ') + filePath);
                                });
                                const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
                                thumbnailJson[0].id = Utils.mergePaths(url, pathToThumb);
                                json.thumbnail = thumbnailJson;
                            }).catch(function (err) {
                                //console.log(chalk.red(err));
                                console.warn(chalk.yellow('unable to generate thumbnail for: ') + filePath);
                            });
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

        let origin: string = url.origin;
        let urlParts: string[];

        if (url.protocol === 'dat:') {
            origin = 'dat://';
            urlParts = url.href.replace(origin, '').split('/');
        } else {
            urlParts = url.href.replace(origin + '/', '').split('/');
        }

        filePath = filePath.replace(/\\/g, '/');
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
}