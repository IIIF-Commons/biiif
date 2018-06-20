const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

const manifest = '/files-only-manifest';
const manifestUrl = 'http://test.com/files-only-manifest';

it('can build manifest', async () => {
    assert(await Utils.fileExists(manifest));
    return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it('happens after build', async () => {
    console.log('I should happen after build');
});
