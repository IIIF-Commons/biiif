const { assert, build, urljoin } = require("../common");
const { fileExists, readJson } = require("../../Utils");

const collection = "/epub-collection";
const collectionUrl = "http://test.com/epub-collection";

it("can build epub collection", async () => {
  assert(await fileExists(collection));
  return build(collection, collectionUrl);
}).timeout(1000); // should take less than a second

it("can find collection index.json", async () => {
  const file = "/epub-collection/index.json";
  assert(await fileExists(file));
  collectionJson = await readJson(file);
});

describe("painting opf", async () => {
  let manifest = "/alice-in-wonderland";
  let manifestJson, canvases;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await fileExists(file));
    manifestJson = await readJson(file);
    canvases = manifestJson.items;
    assert(canvases.length === 1);
  });

  it("can find canvas", async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(canvasJson.id === collectionUrl + manifest + "/index.json/canvas/0");
  });

  it("has correct canvas label", async () => {
    assert(canvasJson.label["@none"][0] === "_alice-in-wonderland");
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        collectionUrl + manifest + "/index.json/canvas/0/annotationpage/0"
    );
  });

  it("has annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has correct annotation id", async () => {
    assert(
      annotation.id ===
        collectionUrl + manifest + "/index.json/canvas/0/annotation/0"
    );
  });

  it("has correct annotation motivation", async () => {
    assert(annotation.motivation === "painting");
  });

  it("has correct annotation target", async () => {
    assert(
      annotation.target === collectionUrl + manifest + "/index.json/canvas/0"
    );
  });

  it("has an annotation body", async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
  });

  it("has correct annotation body id", async () => {
    assert(
      annotationBody.id ===
        "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf"
    );
  });

  it("has correct annotation body type", async () => {
    assert(annotationBody.type === "Text");
  });

  it("has correct annotation body format", async () => {
    assert(annotationBody.format === "application/oebps-package+xml");
  });
});

describe("painting epub", async () => {
  let manifest = "/cc-shared-culture";
  let manifestJson, canvases;

  it("can find " + manifest + " index.json", async () => {
    const file = urljoin(collection, manifest, "index.json");
    assert(await fileExists(file));
    manifestJson = await readJson(file);
    canvases = manifestJson.items;
    assert(canvases.length === 1);
  });

  it("can find canvas", async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(canvasJson.id === collectionUrl + manifest + "/index.json/canvas/0");
  });

  it("has correct canvas label", async () => {
    assert(canvasJson.label["@none"][0] === "_cc-shared-culture");
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        collectionUrl + manifest + "/index.json/canvas/0/annotationpage/0"
    );
  });

  it("has annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has correct annotation id", async () => {
    assert(
      annotation.id ===
        collectionUrl + manifest + "/index.json/canvas/0/annotation/0"
    );
  });

  it("has correct annotation motivation", async () => {
    assert(annotation.motivation === "painting");
  });

  it("has correct annotation target", async () => {
    assert(
      annotation.target === collectionUrl + manifest + "/index.json/canvas/0"
    );
  });

  it("has an annotation body", async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
  });

  it("has correct annotation body id", async () => {
    assert(
      annotationBody.id ===
        "http://test.com/epub-collection/cc-shared-culture/_cc-shared-culture/cc-shared-culture.epub"
    );
  });

  it("has correct annotation body type", async () => {
    assert(annotationBody.type === "Text");
  });

  it("has correct annotation body format", async () => {
    assert(annotationBody.format === "application/epub+zip");
  });
});
