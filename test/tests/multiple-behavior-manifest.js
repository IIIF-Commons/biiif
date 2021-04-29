const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson;
const manifest = "/multiple-behavior-manifest";
const manifestUrl = "http://test.com/multiple-behavior-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/multiple-behavior-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has paged and auto behavior", async () => {
  assert(manifestJson.behavior[0] === "paged");
  assert(manifestJson.behavior[1] === "unordered");
});
