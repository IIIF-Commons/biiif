const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = "/image-dimensions-manifest";
const manifestUrl = "http://test.com/image-dimensions-manifest";

it("can build manifest", async () => {
  assert(await Utils.fileExists(manifest));
  return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/image-dimensions-manifest/index.json";
  assert(await Utils.fileExists(file));
  manifestJson = await Utils.readJson(file);
});

it("can find canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("has correct canvas id", async () => {
  assert(canvasJson.id === manifestUrl + "/index.json/canvas/0");
});

it("has correct canvas width and height", async () => {
  assert(canvasJson.width === 582);
  assert(canvasJson.height === 328);
});

it("has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("has annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("has correct annotation width and height", async () => {
  assert(annotationBody.width === 582);
  assert(annotationBody.height === 328);
});
