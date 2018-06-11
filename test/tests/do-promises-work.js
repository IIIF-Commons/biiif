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

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = '/files-only-manifest';
const manifestUrl = 'http://test.com/files-only-manifest';

it('can build manifest', async () => {
    assert(await Utils.fileExists(manifest));
    return build(manifest, manifestUrl, false);
}).timeout(3000); // should take less than a second

it('happens after build', async () => {
    console.log('I should happen after build');
});
