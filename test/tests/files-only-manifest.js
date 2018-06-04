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

let manifestJson, canvasJson, annotationPage;
const manifest = '/files-only-manifest';
const manifestUrl = 'http://test.com/files-only-manifest';

it('can build manifest', async () => {
    assert(fs.existsSync(manifest));
    build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it('can find ' + manifest + ' index.json', async () => {
    const file = urljoin(manifest, 'index.json');
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
});