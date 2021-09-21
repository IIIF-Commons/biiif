const { assert, build, urljoin } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let collectionJson, thumbnailJson, item, manifestJson;
const collection = "/collection";
const collectionUrl =
  "http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772";

it("can build collection", async () => {
  assert(await fileExists(collection));
  return build(
    collection,
    collectionUrl,
    false,
    "0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772"
  );
}).timeout(1000); // should take less than a second

it("can find collection index.json", async () => {
  const file = "/collection/index.json";
  assert(await fileExists(file));
  collectionJson = await readJson(file);
});

it("has correct collection id", async () => {
  assert(collectionJson.id === collectionUrl + "/index.json");
});

it("has correct collection label", async () => {
  assert(collectionJson.label["@none"][0] === "My Test Collection");
});

it("has a collection thumbnail", async () => {
  thumbnailJson = collectionJson.thumbnail[0];
  assert(thumbnailJson);
});

it("has the correct collection thumbnail id", async () => {
  const id = urljoin(collectionUrl, "thumb.png");
  assert(thumbnailJson.id === id);
});

it("has correct number of items", async () => {
  assert(collectionJson.items.length === 5);
});

it("has an item manifest", async () => {
  item = collectionJson.items[0];
  assert(item);
});

it("has correct item id", async () => {
  assert(item.id === collectionUrl + "/a_manifest/index.json");
});

it("has correct item label", async () => {
  assert(item.label["@none"][0] === "A Manifest");
});

it("has item thumbnail", async () => {
  thumbnailJson = item.thumbnail;
  assert(thumbnailJson);
});

it("has a linked item manifest", async () => {
  item = collectionJson.items[1];
  assert(item);
});

it("has correct linked item id", async () => {
  assert(item.id === "http://test.com/collection/linkedmanifest1/index.json");
});

it("has correct linked item label", async () => {
  assert(item.label["@none"][0] === "Linked Manifest 1");
});

it("has linked item thumbnail", async () => {
  thumbnailJson = item.thumbnail;
  assert(thumbnailJson);
});

it("has correct linked item thumbnail id", async () => {
  assert(
    thumbnailJson[0].id ===
      "http://test.com/collection/linkedmanifest1/thumb.jpg"
  );
});

it("has a linked item manifest", async () => {
  item = collectionJson.items[3];
  assert(item);
});

it("has correct linked item id", async () => {
  assert(item.id === "http://test.com/collection/linkedmanifest3/index.json");
});

it("has correct linked item label", async () => {
  assert(item.label["@none"][0] === "linkedmanifest3");
});

it("can find manifest index.json", async () => {
  const file = "/collection/a_manifest/index.json";
  assert(await fileExists(file));
  manifestJson = await readJson(file);
});

it("has correct manifest id", async () => {
  assert(manifestJson.id === collectionUrl + "/a_manifest/index.json");
});

it("has correct manifest label", async () => {
  assert(manifestJson.label["@none"][0] === "A Manifest");
});

it("can find canvas", async () => {
  canvasJson = manifestJson.items[0];
  assert(canvasJson);
});

it("has correct canvas id", async () => {
  assert(canvasJson.id === collectionUrl + "/a_manifest/index.json/canvas/0");
});

it("has correct canvas label", async () => {
  assert(canvasJson.label["@none"][0] === "A Canvas");
});

it("has a canvas thumbnail", async () => {
  thumbnailJson = canvasJson.thumbnail[0];
  assert(thumbnailJson);
});

it("has the correct canvas thumbnail id", async () => {
  const id = urljoin(collectionUrl, "/a_manifest/_canvas/thumb.png");
  assert(thumbnailJson.id === id);
});

it("has an annotation page", async () => {
  annotationPage = canvasJson.items[0];
  assert(annotationPage);
});

it("has the correct annotation page id", async () => {
  annotationPage = canvasJson.items[0];
  assert(
    annotationPage.id ===
      collectionUrl + "/a_manifest/index.json/canvas/0/annotationpage/0"
  );
});

it("has an annotation", async () => {
  annotation = annotationPage.items[0];
  assert(annotation);
});

it("has an image annotation body", async () => {
  imageAnnotation = annotation.body;
  assert(imageAnnotation);
});

it("has an annotation body", async () => {
  imageAnnotation = annotation.body;
  assert(imageAnnotation);
});

it("has correct annotation id", async () => {
  assert(
    imageAnnotation.id === collectionUrl + "/a_manifest/_canvas/page_1.jpg"
  );
});

describe("sub-collection", async () => {
  it("can find collection index.json", async () => {
    const file = "/collection/sub-collection/index.json";
    assert(await fileExists(file));
    collectionJson = await readJson(file);
  });

  it("has correct collection id", async () => {
    assert(collectionJson.id === collectionUrl + "/sub-collection/index.json");
  });

  it("has correct collection label", async () => {
    assert(collectionJson.label["@none"][0] === "My Test Sub-collection");
  });

  it("has a collection thumbnail", async () => {
    thumbnailJson = collectionJson.thumbnail[0];
    assert(thumbnailJson);
  });

  it("has the correct collection thumbnail id", async () => {
    const id = urljoin(collectionUrl, "/sub-collection/thumb.png");
    assert(thumbnailJson.id === id);
  });

  it("has a item manifest", async () => {
    item = collectionJson.items[0];
    assert(item);
  });

  it("has correct item id", async () => {
    assert(item.id === collectionUrl + "/sub-collection/b_manifest/index.json");
  });

  it("has correct item label", async () => {
    assert(item.label["@none"][0] === "My Test Submanifest");
  });

  it("has item thumbnail", async () => {
    thumbnailJson = item.thumbnail;
    assert(thumbnailJson);
  });

  it("has correct item thumbnail id", async () => {
    assert(
      thumbnailJson[0].id ===
        collectionUrl + "/sub-collection/b_manifest/thumb.png"
    );
  });

  it("can find manifest index.json", async () => {
    const file = "/collection/sub-collection/b_manifest/index.json";
    assert(await fileExists(file));
    manifestJson = await readJson(file);
  });

  it("has correct manifest id", async () => {
    assert(
      manifestJson.id === collectionUrl + "/sub-collection/b_manifest/index.json"
    );
  });

  it("has correct manifest label", async () => {
    assert(manifestJson.label["@none"][0] === "My Test Submanifest");
  });

  it("can find canvas", async () => {
    canvasJson = manifestJson.items[0];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(
      canvasJson.id ===
        collectionUrl + "/sub-collection/b_manifest/index.json/canvas/0"
    );
  });

  it("has correct canvas label", async () => {
    assert(canvasJson.label["@none"][0] === "My Test Subcanvas");
  });

  it("has a canvas thumbnail", async () => {
    thumbnailJson = canvasJson.thumbnail[0];
    assert(thumbnailJson);
  });

  it("has the correct canvas thumbnail id", async () => {
    const id = urljoin(
      collectionUrl,
      "/sub-collection/b_manifest/_canvas/thumb.png"
    );
    assert(thumbnailJson.id === id);
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        collectionUrl +
          "/sub-collection/b_manifest/index.json/canvas/0/annotationpage/0"
    );
  });

  it("has an annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has an image annotation body", async () => {
    imageAnnotation = annotation.body;
    assert(imageAnnotation);
  });

  it("has an annotation body", async () => {
    imageAnnotation = annotation.body;
    assert(imageAnnotation);
  });

  it("image annotation has correct id", async () => {
    assert(
      imageAnnotation.id ===
        collectionUrl + "/sub-collection/b_manifest/_canvas/page_1.jpg"
    );
  });
});
