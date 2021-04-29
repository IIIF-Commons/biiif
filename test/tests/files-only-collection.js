const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let collectionJson, manifestJson, canvasJson, annotationPage;
const collection = "/files-only-collection";
const collectionUrl = "http://test.com/files-only-collection";

it("can build collection", async () => {
  assert(await fileExists(collection));
  return build(collection, collectionUrl);
}).timeout(1000); // should take less than a second

it("can find collection index.json", async () => {
  const file = "/files-only-collection/index.json";
  assert(await fileExists(file));
  collectionJson = await readJson(file);
});

it("has correct collection id", async () => {
  assert(
    collectionJson.id === "http://test.com/files-only-collection/index.json"
  );
});

it("can find manifest index.json", async () => {
  const file = "/files-only-collection/files-only-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has correct manifest id", async () => {
  assert(
    manifestJson.id ===
      "http://test.com/files-only-collection/files-only-manifest/index.json"
  );
});

it("has correct number of canvases", async () => {
  assert(manifestJson.items.length === 3);
});

it("can find canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("has correct canvas id", async () => {
  assert(
    canvasJson.id ===
      "http://test.com/files-only-collection/files-only-manifest/index.json/canvas/0"
  );
});

it("has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-collection/files-only-manifest/index.json/canvas/0/annotationpage/0"
  );
});

it("has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("has correct annotation id", async () => {
  assert(
    annotationBody.id ===
      "http://test.com/files-only-collection/files-only-manifest/file.gltf"
  );
});
