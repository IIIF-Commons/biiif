const common = require("../common");
const assert = common.assert;
const urljoin = common.urljoin;
const Utils = common.Utils;

let manifestJson, canvasJson, annotationPage;
const manifest = '/collection/erroneous-file';

it('can find ' + manifest + ' index.json', async () => {
    const file = urljoin(manifest, 'index.json');
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
    canvasJson = manifestJson.items[0];
});

it('has no content annotations', async () => {
    assert(canvasJson);        
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
    assert(annotationPage.items.length === 0);
});