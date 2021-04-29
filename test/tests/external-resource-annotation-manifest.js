const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotation, annotationPage, annotationBody;
const manifest = "/external-resource-annotation-manifest";
const customAnnotationsManifestUrl =
  "http://test.com/external-resource-annotation-manifest";

it("can build custom annotations collection", async () => {
  assert(await fileExists(manifest));
  return build(manifest, customAnnotationsManifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/external-resource-annotation-manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

describe("commenting text with format", async () => {
  it("can find canvas", async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(
      canvasJson.id === customAnnotationsManifestUrl + "/index.json/canvas/0"
    );
  });

  it("has correct canvas label", async () => {
    assert(canvasJson.label["@none"][0] === "_platypus");
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/0/annotationpage/0"
    );
  });

  it("has annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has correct annotation id", async () => {
    assert(
      annotation.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/0/annotation/0"
    );
  });

  it("has correct annotation motivation", async () => {
    assert(annotation.motivation === "painting");
  });

  it("has correct annotation target", async () => {
    assert(
      annotation.target ===
        customAnnotationsManifestUrl + "/index.json/canvas/0"
    );
  });

  it("has an annotation body", async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
  });

  it("has correct annotation body id", async () => {
    assert(
      annotationBody.id ===
        "https://www.morphosource.org/media/morphosource/dcm_sample/platypus/platypus_manifest_20_slices.json"
    );
  });

  it("has correct annotation body type", async () => {
    assert(annotationBody.type === "Text");
  });

  it("has correct annotation body format", async () => {
    assert(annotationBody.format === "application/json");
  });
});
