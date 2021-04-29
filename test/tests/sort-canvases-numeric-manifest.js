const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvases;
const manifest = "/sort-canvases-numeric-manifest";
const manifestUrl = "http://test.com/sort-canvases-numeric-manifest";

it("can build sort canvases numeric manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(3000);

it("can find manifest index.json", async () => {
  const file = "/sort-canvases-numeric-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("sorts canvases correctly", async () => {
  canvases = manifestJson.items;
  assert(canvases.length === 21);
  assert(
    canvases[0].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/0"
  );
  assert(
    canvases[1].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/1"
  );
  assert(
    canvases[2].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/2"
  );
  assert(
    canvases[10].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/10"
  );
  assert(
    canvases[11].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/11"
  );
  assert(
    canvases[20].id ===
      "http://test.com/sort-canvases-numeric-manifest/index.json/canvas/20"
  );
});
