const { assert, build, urljoin, canvasHasContentAnnotations } = require("../common");
const { fileExists, readJson } = require("../../Utils");

const collection = "/file-annotation-collection";
const collectionUrl = "http://test.com/file-annotation-collection";

it("can build collection", async () => {
  assert(await fileExists(collection));
  return build(collection, collectionUrl);
}).timeout(2000);

it("can find collection index.json", async () => {
  const file = urljoin(collection, "/index.json");
  assert(await fileExists(file));
  collectionJson = await readJson(file);
});

describe("canvas per file", async () => {
  let manifest = "canvas-per-file";
  let manifestJson, canvases;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await fileExists(file));
    manifestJson = await readJson(file);
    canvases = manifestJson.items;
    assert(canvases.length === 10);
  });

  it("has all content annotations", async () => {
    // todo: fix ffprobe - unable to load mp3, mp4
    // remember to change [index] for these if making alterations
    canvasHasContentAnnotations(canvases[0], ["file.crt"]);
    canvasHasContentAnnotations(canvases[1], ["file.drc"]);
    canvasHasContentAnnotations(canvases[2], ["file.gltf"]);
    canvasHasContentAnnotations(canvases[3], ["file.jpg"]);
    canvasHasContentAnnotations(canvases[4], ["file.json"]);
    // canvasHasContentAnnotations(canvases[5], ["file.mp3"]);
    // canvasHasContentAnnotations(canvases[6], ["file.mp4"]);
    canvasHasContentAnnotations(canvases[5], ["file.obj"]);
    canvasHasContentAnnotations(canvases[6], ["file.pdf"]);
    canvasHasContentAnnotations(canvases[7], ["file.ply"]);
    canvasHasContentAnnotations(canvases[8], ["file.png"]);
    canvasHasContentAnnotations(canvases[9], ["file.usdz"]);
  });
});

describe("files per canvas", async () => {
  let manifest = "files-per-canvas";
  let manifestJson, canvasJson;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await fileExists(file));
    manifestJson = await readJson(file);
  });

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await fileExists(file));
    manifestJson = await readJson(file);
    canvasJson = manifestJson.items[0];
  });

  it("has all content annotations", async () => {
    canvasHasContentAnnotations(canvasJson, [
      "file.crt",
      "file.drc",
      "file.gltf",
      "file.jpg",
      "file.json",
      // "file.mp3",
      // "file.mp4",
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
    assert(await fileExists(file));
    manifestJson = await readJson(file);
    canvasJson = manifestJson.items[0];
  });

  it("has no content annotations", async () => {
    assert(canvasJson);
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
    assert(annotationPage.items.length === 0);
  });
});
