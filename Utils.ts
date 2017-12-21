const { existsSync } = require('fs');
const { glob } = require('glob');
const { join } = require('path');
const thumbnailBoilerplate = require('./boilerplate/thumbnail');
const urljoin = require('url-join');

export class Utils {

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

                const item: any = {}
                item.label = key;
                item.value = value;

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
            let thumbnail: string = thumbnails[0];
            const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
            thumbnailJson[0].id = Utils.mergePaths(url, thumbnail);
            json.thumbnail = thumbnailJson;
        }
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

        const urlParts: string[] = url.href.replace(url.origin + '/', '').split('/');
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

        let id: string = urljoin(url.origin, ...newPath.reverse());

        return id;
    }
}