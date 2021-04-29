const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvases;
const manifest = "/sort-canvases-manifest";
const manifestUrl = "http://test.com/sort-canvases-manifest";

it("can build sort canvases manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(2000);

it("can find manifest index.json", async () => {
  const file = "/sort-canvases-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("sorts canvases correctly", async () => {
  canvases = manifestJson.items;
  assert(canvases.length === 11);
  assert(
    canvases[0].id ===
      "http://test.com/sort-canvases-manifest/index.json/canvas/0"
  );
  assert(
    canvases[1].id ===
      "http://test.com/sort-canvases-manifest/index.json/canvas/1"
  );
  assert(
    canvases[2].id ===
      "http://test.com/sort-canvases-manifest/index.json/canvas/2"
  );
  assert(
    canvases[10].id ===
      "http://test.com/sort-canvases-manifest/index.json/canvas/10"
  );
});
