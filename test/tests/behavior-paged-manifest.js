const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson;
const manifest = "/behavior-paged-manifest";
const manifestUrl = "http://test.com/behavior-paged-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/behavior-paged-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has paged behavior", async () => {
  assert(manifestJson.behavior[0] === "paged");
});
