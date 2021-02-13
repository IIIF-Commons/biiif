const common = require("../common");
const assert = common.assert;
const build = common.build;
const urljoin = common.urljoin;
const Utils = common.Utils;
const canvasHasContentAnnotations = common.canvasHasContentAnnotations;

const collection = "/file-annotation-collection";
const collectionUrl = "http://test.com/file-annotation-collection";

it("can build collection", async () => {
  assert(await Utils.fileExists(collection));
  return build(collection, collectionUrl);
}).timeout(2000);

it("can find collection index.json", async () => {
  const file = urljoin(collection, "/index.json");
  assert(await Utils.fileExists(file));
  collectionJson = await Utils.readJson(file);
});

describe("canvas per file", async () => {
  let manifest = "canvas-per-file";
  let manifestJson, canvases;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
    canvases = manifestJson.items;
    assert(canvases.length === 12);
  });

  it("has all content annotations", async () => {
    canvasHasContentAnnotations(canvases[0], ["file.crt"]);
    canvasHasContentAnnotations(canvases[1], ["file.drc"]);
    canvasHasContentAnnotations(canvases[2], ["file.gltf"]);
    canvasHasContentAnnotations(canvases[3], ["file.jpg"]);
    canvasHasContentAnnotations(canvases[4], ["file.json"]);
    canvasHasContentAnnotations(canvases[5], ["file.mp3"]);
    canvasHasContentAnnotations(canvases[6], ["file.mp4"]);
    canvasHasContentAnnotations(canvases[7], ["file.obj"]);
    canvasHasContentAnnotations(canvases[8], ["file.pdf"]);
    canvasHasContentAnnotations(canvases[9], ["file.ply"]);
    canvasHasContentAnnotations(canvases[10], ["file.png"]);
    canvasHasContentAnnotations(canvases[11], ["file.usdz"]);
  });
});

describe("files per canvas", async () => {
  let manifest = "files-per-canvas";
  let manifestJson, canvasJson;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
  });

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
    canvasJson = manifestJson.items[0];
  });

  it("has all content annotations", async () => {
    canvasHasContentAnnotations(canvasJson, [
      "file.crt",
      "file.drc",
      "file.gltf",
      "file.jpg",
      "file.json",
      "file.mp3",
      "file.mp4",
      "file.obj",
      "file.pdf",
      "file.ply",
      "file.png",
      "file.usdz",
    ]);
  });
});

describe("erroneous file", async () => {
  let manifest = "erroneous-file";
  let manifestJson, canvasJson, annotationPage;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
    canvasJson = manifestJson.items[0];
  });

  it("has no content annotations", async () => {
    assert(canvasJson);
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
    assert(annotationPage.items.length === 0);
  });
});
