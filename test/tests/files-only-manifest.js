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

it('can build manifest', async (done) => {
    assert(fs.existsSync(manifest));
    await build(manifest, manifestUrl, false);
    done();
}).timeout(1000); // should take less than a second

it('can find ' + manifest + ' index.json', async () => {
    const file = urljoin(manifest, 'index.json');
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
});

it('has correct manifest id', async () => {
    assert(manifestJson.id === 'http://test.com/files-only-manifest/index.json');
});

it('has correct number of canvases', async () => {
    assert(manifestJson.items.length === 3);
});

it('can find canvas', async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
});

it('has correct canvas id', async () => {
    assert(canvasJson.id === 'http://test.com/files-only-manifest/index.json/canvas/0');
});

it('has an annotation page', async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
});

it('has the correct annotation page id', async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage.id === 'http://test.com/files-only-manifest/index.json/canvas/0/annotationpage/0');
});

it('has an annotation', async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
});

it('has an annotation body', async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
});

it('has correct annotation id', async () => {
    assert(annotationBody.id === 'http://test.com/files-only-manifest/file.gltf');
});