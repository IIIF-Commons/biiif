const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let collectionJson, thumbnailJson, manifestJson, canvasJson;
const collection = '/gh-collection';
const githubpagesUrl = 'https://username.github.io/uv-app-starter-fork/gh-collection';

it('can build collection', async () => {
    assert(await Utils.fileExists(collection));
    return build(collection, githubpagesUrl, true);
}).timeout(1000); // should take less than a second

it('can find collection index.json', async () => {
    const file = '/gh-collection/index.json';
    assert(await Utils.fileExists(file));
    collectionJson = await Utils.readJson(file);
});

it('has correct collection id', async () => {
    assert(collectionJson.id === githubpagesUrl + '/index.json');
});

it('has a manifest', async () => {
    item = collectionJson.items[0];
    assert(item);
});

it('has correct manifest id', async () => {
    assert(item.id === githubpagesUrl + '/vertebra/index.json');
});

it('has correct manifest label', async () => {
    assert(item.label['@none'][0] === 'Vertebra');
});

it('has manifest thumbnail', async () => {
    thumbnailJson = item.thumbnail;
    assert(thumbnailJson);
});

it('has correct manifest thumbnail id', async () => {
    const id = thumbnailJson[0].id;
    assert(id === githubpagesUrl + '/vertebra/thumb.jpg');
});

it('can find manifest index.json', async () => {
    const file = '/gh-collection/vertebra/index.json';
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
});

it('can find canvas', async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === githubpagesUrl + '/vertebra/index.json/canvas/0');
});