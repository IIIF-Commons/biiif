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

let collectionJson, manifestJson, canvasJson, thumbnailJson, item, annotationPage, imageAnnotation;
const collectionUrl = 'http://test.com/collection';

it('can build collection', async () => {
    assert(fs.existsSync('/manifests-collection'));
    build('/manifests-collection', collectionUrl, false);
}).timeout(1000); // should take less than a second

it('can find collection index.json', async () => {
    const file = '/manifests-collection/index.json';
    assert(fs.existsSync(file));
    collectionJson = jsonfile.readFileSync(file);
});

it('has correct number of items', async () => {
    assert(collectionJson.items.length === 3);
});