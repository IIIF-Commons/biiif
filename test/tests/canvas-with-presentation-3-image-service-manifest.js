const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson,
  canvasJson,
  annotationPage,
  annotation,
  annotationBody,
  service;
const manifest = "/canvas-with-presentation-3-image-service-manifest";
const manifestUrl =
  "http://test.com/canvas-with-presentation-3-image-service-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/canvas-with-presentation-3-image-service-manifest/index.json";
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

it("has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("has annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("has correct annotation motivation", async () => {
  assert(annotation.motivation === "painting");
});

it("has correct annotation target", async () => {
  assert(annotation.target === manifestUrl + "/index.json/canvas/0");
});

it("has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("has correct annotation body id", async () => {
  assert(
    annotationBody.id ===
      manifestUrl +
        "/_canvas-with-presentation-3-image-service/assets/tiles/info.json"
  );
});

it("has correct annotation body type", async () => {
  assert(annotationBody.type === "Image");
});

it("has correct annotation body format", async () => {
  assert(annotationBody.format === "image/jpeg");
});

it("has an image service", async () => {
  service = annotationBody.service;
  assert(service && service.length);
});

it("has correct image service id", async () => {
  assert(
    service[0].id ===
      manifestUrl + "/_canvas-with-presentation-3-image-service/assets/tiles"
  );
});
