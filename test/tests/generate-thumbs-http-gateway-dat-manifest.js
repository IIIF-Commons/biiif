const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson, canvasJson, thumbnailJson;
const manifest = "/generate-thumbs-dat-manifest";
const datId =
  "5fe9b8d2ce257bccf05211597350d2459d7cf76701264cca70f3ffbec7bf605f";
const generateThumbsManifestUrl = "http://174.138.105.19:3000/" + datId;

it("can build generate-thumbs-dat-manifest", async () => {
  assert(await Utils.fileExists(manifest));
  return build(manifest, generateThumbsManifestUrl, true, datId);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/generate-thumbs-dat-manifest/index.json";
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
    thumbnailJson.id === generateThumbsManifestUrl + "/_page-1/thumb.jpeg"
  );
});
