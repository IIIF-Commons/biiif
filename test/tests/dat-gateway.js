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

let collectionJson, thumbnailJson, item, manifestJson;
const datGatewayUrl = 'http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772';

it('can build collection', async () => {
    assert(fs.existsSync('/dat-gateway-collection'));
    build('/dat-gateway-collection', datGatewayUrl);
}).timeout(1000); // should take less than a second

it('can find collection index.json', async () => {
    const file = '/dat-gateway-collection/index.json';
    assert(fs.existsSync(file));
    collectionJson = jsonfile.readFileSync(file);
});

it('has correct collection id', async () => {
    assert(collectionJson.id === datGatewayUrl + '/index.json');
});

it('has a manifest', async () => {
    item = collectionJson.items[0];
    assert(item);
});

it('has correct manifest id', async () => {
    assert(item.id === datGatewayUrl + '/vertebra/index.json');
});

it('has manifest thumbnail', async () => {
    thumbnailJson = item.thumbnail;
    assert(thumbnailJson);
});

it('has correct manifest thumbnail id', async () => {
    const id = thumbnailJson[0].id;
    assert(id === datGatewayUrl + '/vertebra/thumb.jpg');
});

it('can find manifest index.json', async () => {
    const file = '/dat-gateway-collection/vertebra/index.json';
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
});

it('can find canvas', async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === datGatewayUrl + '/vertebra/index.json/canvas/0');
});