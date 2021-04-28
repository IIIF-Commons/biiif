const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson, canvasJson, thumbnailJson;
const manifest = "/generate-thumbs-manifest";
const generateThumbsManifestUrl = "http://test.com/generate-thumbs-manifest";

it("can build generate-thumbs-manifest", async () => {
  assert(await Utils.fileExists(manifest));
  return build(manifest, generateThumbsManifestUrl, true);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/generate-thumbs-manifest/index.json";
  assert(await Utils.fileExists(file));
  manifestJson = await Utils.readJson(file);
});

it("can find canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("has correct canvas id", async () => {
  assert(canvasJson.id === generateThumbsManifestUrl + "/index.json/canvas/0");
});

it("has correct canvas id", async () => {
  assert(canvasJson.id === generateThumbsManifestUrl + "/index.json/canvas/0");
});

it("has a canvas thumbnail", async () => {
  thumbnailJson = canvasJson.thumbnail[0];
  assert(thumbnailJson);
});

it("has correct canvas thumbnail id", async () => {
  assert(
    thumbnailJson.id === generateThumbsManifestUrl + "/_page-1/thumb.jpg"
  );
});
