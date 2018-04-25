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

let collectionJson, thumbnailJson, item;
const githubpagesUrl = 'https://username.github.io/uv-app-starter-fork/gh-collection';

it('can build collection', async () => {
    assert(fs.existsSync('/gh-collection'));
    build('/gh-collection', githubpagesUrl);
}).timeout(1000); // should take less than a second

it('can find collection index.json', async () => {
    const file = '/gh-collection/index.json';
    assert(fs.existsSync(file));
    collectionJson = jsonfile.readFileSync(file);
});

it('has correct collection id', async () => {
    assert(collectionJson.id === githubpagesUrl + '/index.json');
});

it('has an item manifest', async () => {
    item = collectionJson.items[0];
    assert(item);
});

it('has correct item id', async () => {
    assert(item.id === 'https://username.github.io/uv-app-starter-fork/gh-collection/vertebra/index.json');
});

it('has item thumbnail', async () => {
    thumbnailJson = item.thumbnail;
    assert(thumbnailJson);
});

it('has correct item thumbnail id', async () => {
    const id = thumbnailJson[0].id;
    assert(id === 'https://username.github.io/uv-app-starter-fork/gh-collection/vertebra/thumb.jpg');
});