const { glob } = require('glob');
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

    public static getThumbnail(json: any, url: URL, filePath: string): void {
        const thumbnailPattern: string = filePath + '/thumb.*';
        const thumbnails: string[] = glob.sync(thumbnailPattern);

        if (thumbnails.length) {
            let thumbnail: string = thumbnails[0];
            // get the part after and inclusive of the canvas
            thumbnail = thumbnail.substr(thumbnail.lastIndexOf('_'));
            const thumbnailJson: any = Utils.cloneJson(thumbnailBoilerplate);
            thumbnailJson[0].id = urljoin(url.href, thumbnail);
            json.thumbnail = thumbnailJson;
        }
    }
}