const common = require("../common");
const assert = common.assert;
const basename = common.basename;
const build = common.build;
const config = common.config;
const mock = common.mock;
const URL = common.URL;
const urljoin = common.urljoin;
const Utils = common.Utils;

let manifestJson, canvasJson, thumbnailJson;
const manifest = '/thumbs-single-manifest';
const manifestUrl = 'http://test.com/thumbs-single-manifest';

it('can build manifest', async () => {
    config.jimpEnabled = false;
    assert(await Utils.fileExists(manifest));
    return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second

it('can find manifest index.json', async () => {
    const file = '/thumbs-single-manifest/index.json';
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
});

it('can find canvas', async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === manifestUrl + '/index.json/canvas/0');
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === manifestUrl + '/index.json/canvas/0');
});

it('has a canvas thumbnail', async () => {
    thumbnailJson = canvasJson.thumbnail[0];
    assert(thumbnailJson);
});

it('has correct canvas thumbnail url', async () => {
    assert(thumbnailJson.id === "http://test.com/thumbs-single-manifest/thumb.jpeg");
});