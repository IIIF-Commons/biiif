const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson, canvasJson, thumbnailJson;
const manifest = '/canvas-with-dimensions-manifest';
const manifestUrl = 'http://test.com/canvas-with-dimensions-manifest';

it('can build manifest', async () => {
    assert(await Utils.fileExists(manifest));
    return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second

it('can find manifest index.json', async () => {
    const file = '/canvas-with-dimensions-manifest/index.json';
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

it('has correct dimensions', async () => {
    assert(canvasJson.width === 600);
    assert(canvasJson.height === 400);
});