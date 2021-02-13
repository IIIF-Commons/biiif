const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson;
const manifest = "/multiple-behavior-manifest";
const manifestUrl = "http://test.com/multiple-behavior-manifest";

it("can build manifest", async () => {
  assert(await Utils.fileExists(manifest));
  return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/multiple-behavior-manifest/index.json";
  assert(await Utils.fileExists(file));
  manifestJson = await Utils.readJson(file);
});

it("has paged and auto behavior", async () => {
  assert(manifestJson.behavior[0] === "paged");
  assert(manifestJson.behavior[1] === "unordered");
});
