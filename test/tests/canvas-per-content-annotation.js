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
const canvasHasContentAnnotations = common.canvasHasContentAnnotations;

let manifestJson, canvasJson;

const manifest = '/collection/canvas-per-file';
let canvases;

it('can find ' + manifest + ' index.json', async () => {
    const file = urljoin(manifest, 'index.json');
    assert(fs.existsSync(file));
    manifestJson = jsonfile.readFileSync(file);
    canvases = manifestJson.items;
});

it('has all content annotations', async () => {
    canvasHasContentAnnotations(canvases[0], ['file.crt']);
    canvasHasContentAnnotations(canvases[1], ['file.drc']);
    canvasHasContentAnnotations(canvases[2], ['file.gltf']);
    canvasHasContentAnnotations(canvases[3], ['file.jpg']);
    canvasHasContentAnnotations(canvases[4], ['file.json']);
    canvasHasContentAnnotations(canvases[5], ['file.mp4']);
    canvasHasContentAnnotations(canvases[6], ['file.obj']);
    canvasHasContentAnnotations(canvases[7], ['file.pdf']);
    canvasHasContentAnnotations(canvases[8], ['file.ply']);
    canvasHasContentAnnotations(canvases[9], ['file.png']);
});