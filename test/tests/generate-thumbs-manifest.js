const common = require("../common");
const assert = common.assert;
const basename = common.basename;
const build = common.build;
const fs = common.fs;
const jsonfile = common.jsonfile;
const mock = common.mock;
const URL = common.URL;
const urljoin = common.urljoin;
const Utils = common.Utils;

let manifestJson, canvasJson;
const generateThumbsManifestUrl = 'http://test.com/generate-thumbs-manifest';

it('can build generate-thumbs-manifest', async () => {
    assert(fs.existsSync('/generate-thumbs-manifest'));
    build('/generate-thumbs-manifest', generateThumbsManifestUrl, false);
}).timeout(1000); // should take less than a second

it('can find manifest index.json', async () => {
    const file = '/generate-thumbs-manifest/index.json';
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
});

it('can find canvas', async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === generateThumbsManifestUrl + '/index.json/canvas/0');
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === generateThumbsManifestUrl + '/index.json/canvas/0');
});

it('has a canvas thumbnail', async () => {
    // awaiting https://github.com/oliver-moran/jimp/issues/441
    //thumbnailJson = canvasJson.thumbnail[0];
    //assert(thumbnailJson);
});
