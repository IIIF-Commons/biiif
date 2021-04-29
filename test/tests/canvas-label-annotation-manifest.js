const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = "/canvas-label-annotation-manifest";
const manifestUrl = "http://test.com/canvas-label-annotation-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/canvas-label-annotation-manifest/index.json";
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

it("has correct canvas label", async () => {
  assert(canvasJson.label["@none"][0] === "Custom Label");
});

it("has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("has annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("has correct annotation motivation", async () => {
  assert(annotation.motivation === "painting");
});

it("has correct annotation target", async () => {
  assert(annotation.target === manifestUrl + "/index.json/canvas/0");
});

it("has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("has correct annotation label", async () => {
  assert(annotationBody.label["@none"][0] === "Custom Label");
});
