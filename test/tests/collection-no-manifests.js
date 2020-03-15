const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let collectionJson;
const collection = "/manifests-collection";
const collectionUrl = "http://test.com/collection";

it("can build collection", async () => {
  assert(await Utils.fileExists(collection));
  return build(collection, collectionUrl);
}).timeout(1000); // should take less than a second

it("can find collection index.json", async () => {
  const file = "/manifests-collection/index.json";
  assert(await Utils.fileExists(file));
  collectionJson = await Utils.readJson(file);
});

it("has correct number of items", async () => {
  assert(collectionJson.items.length === 3);
});
