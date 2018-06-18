const common = require("../common");
const assert = common.assert;
const basename = common.basename;
const build = common.build;
const mock = common.mock;
const URL = common.URL;
const urljoin = common.urljoin;
const Utils = common.Utils;

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = '/thumbs-single-manifest';
const manifestUrl = 'http://test.com/thumbs-single-manifest';

it('can build manifest', async () => {
    assert(await Utils.fileExists(manifest));
    return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second