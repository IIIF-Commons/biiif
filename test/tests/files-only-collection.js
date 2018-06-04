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

let collectionJson, manifestJson, canvasJson, annotationPage;
const collection = '/files-only-collection';
const collectionUrl = 'http://test.com/files-only-collection';

it('can build collection', async () => {
    assert(fs.existsSync(collection));
    build(collection, collectionUrl);
}).timeout(1000); // should take less than a second

it('can find collection index.json', async () => {
    const file = '/files-only-collection/index.json';
    assert(fs.existsSync(file));
    collectionJson = jsonfile.readFileSync(file);
});

it('can find manifest index.json', async () => {
    const file = '/files-only-collection/files-only-manifest/index.json';
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
});