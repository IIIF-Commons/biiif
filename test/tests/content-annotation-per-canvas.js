const common = require("../common");
const assert = common.assert;
const basename = common.basename;
const build = common.build;
const mock = common.mock;
const URL = common.URL;
const urljoin = common.urljoin;
const Utils = common.Utils;
const canvasHasContentAnnotations = common.canvasHasContentAnnotations;

let manifestJson, canvasJson;

const manifest = '/collection/files-per-canvas';

it('can find ' + manifest + ' index.json', async () => {
    const file = urljoin(manifest, 'index.json');
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
    canvasJson = manifestJson.items[0];
});

it('has all content annotations', async () => {
    canvasHasContentAnnotations(canvasJson, ['file.crt', 'file.drc', 'file.gltf', 'file.jpg', 'file.json', 'file.mp4', 'file.obj', 'file.pdf', 'file.ply', 'file.png']);
});