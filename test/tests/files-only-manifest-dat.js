const { assert, build, urljoin } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotationPage;
const manifest = "/files-only-manifest-dat";
const manifestUrl =
  "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(
    manifest,
    manifestUrl,
    false,
    "0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772"
  );
}).timeout(1000); // should take less than a second

it("can find " + manifest + " index.json", async () => {
  const file = urljoin(manifest, "index.json");
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has correct manifest id", async () => {
  assert(
    manifestJson.id ===
      "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772/index.json"
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
      "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772/index.json/canvas/0"
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
      "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772/index.json/canvas/0/annotationpage/0"
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
      "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772/file.gltf"
  );
});
