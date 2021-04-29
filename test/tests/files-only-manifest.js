const { assert, build, urljoin } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotationPage, annotation, annotationBody;
const manifest = "/files-only-manifest";
const manifestUrl = "http://test.com/files-only-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(100000000); // should take less than a second

it("can find " + manifest + " index.json", async () => {
  const file = urljoin(manifest, "index.json");
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has correct manifest id", async () => {
  assert(manifestJson.id === "http://test.com/files-only-manifest/index.json");
});

it("has correct number of canvases", async () => {
  assert(manifestJson.items.length === 6);
});

// first canvas

it("can find first canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("first canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/0"
  );
});

it("first canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("first canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/0/annotationpage/0"
  );
});

it("first canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("first canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("first canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.glb");
});

// second canvas

it("can find second canvas", async () => {
  canvasJson = manifestJson.items[1];
  assert(canvasJson);
});

it("second canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/1"
  );
});

it("second canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("second canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/1/annotationpage/0"
  );
});

it("second canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("second canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("second canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.gltf");
});

// third canvas

it("can find third canvas", async () => {
  canvasJson = manifestJson.items[2];
  assert(canvasJson);
});

it("third canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/2"
  );
});

it("third canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("third canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/2/annotationpage/0"
  );
});

it("third canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("third canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("third canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.jpeg");
});

// fourth canvas

it("can find fourth canvas", async () => {
  canvasJson = manifestJson.items[3];
  assert(canvasJson);
});

it("fourth canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/3"
  );
});

it("fourth canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("fourth canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/3/annotationpage/0"
  );
});

it("fourth canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("fourth canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("fourth canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.jpg");
});

// fifth canvas

it("can find fifth canvas", async () => {
  canvasJson = manifestJson.items[4];
  assert(canvasJson);
});

it("fifth canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/4"
  );
});

it("fifth canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("fifth canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/4/annotationpage/0"
  );
});

it("fifth canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("fifth canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("fifth canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.png");
});

// sixth canvas

it("can find sixth canvas", async () => {
  canvasJson = manifestJson.items[5];
  assert(canvasJson);
});

it("sixth canvas has correct id", async () => {
  assert(
    canvasJson.id === "http://test.com/files-only-manifest/index.json/canvas/5"
  );
});

it("sixth canvas has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("sixth canvas has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      "http://test.com/files-only-manifest/index.json/canvas/5/annotationpage/0"
  );
});

it("sixth canvas has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("sixth canvas has an annotation body", async () => {
  annotationBody = annotation.body;
  assert(annotationBody);
});

it("sixth canvas has correct annotation id", async () => {
  assert(annotationBody.id === "http://test.com/files-only-manifest/file.usdz");
});
