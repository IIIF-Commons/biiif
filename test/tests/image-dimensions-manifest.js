const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = "/image-dimensions-manifest";
const manifestUrl = "http://test.com/image-dimensions-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/image-dimensions-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("can find canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("has correct canvas id", async () => {
  assert(canvasJson.id === manifestUrl + "/index.json/canvas/0");
});

// todo: can't do this any more as sharp fails with mock-fs
// need to use the actual filesystem
// it("has correct canvas width and height", async () => {
//   assert(canvasJson.width === 582);
//   assert(canvasJson.height === 328);
// });

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

// todo: can't do this any more as sharp fails with mock-fs
// need to use the actual filesystem
// it("has correct annotation width and height", async () => {
//   assert(annotationBody.width === 582);
//   assert(annotationBody.height === 328);
// });
