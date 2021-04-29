const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, thumbnailJson;
const manifest = "/thumbs-single-manifest";
const manifestUrl =
  "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(
    manifest,
    manifestUrl,
    true,
    "0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772"
  );
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/thumbs-single-manifest/index.json";
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

it("has correct canvas id", async () => {
  assert(canvasJson.id === manifestUrl + "/index.json/canvas/0");
});

it("has a canvas thumbnail", async () => {
  thumbnailJson = canvasJson.thumbnail[0];
  assert(thumbnailJson);
});

it("has correct canvas thumbnail url", async () => {
  assert(thumbnailJson.id === manifestUrl + "/thumb.jpg");
});
