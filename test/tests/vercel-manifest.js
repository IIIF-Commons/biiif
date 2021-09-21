const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, thumbnailJson;
const manifest = "/vercel-manifest";
const manifestUrl = "https://biiif-template-code-of-ethics-zine.vercel.app";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/vercel-manifest/index.json";
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

it("has a canvas thumbnail", async () => {
  thumbnailJson = canvasJson.thumbnail[0];
  assert(thumbnailJson);
});

it("has correct canvas thumbnail url", async () => {
  assert(thumbnailJson.id === manifestUrl + "/_page-1/thumb.jpg");
});
