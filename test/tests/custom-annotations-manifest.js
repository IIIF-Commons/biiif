const { assert, build } = require("../common");
const { fileExists, readJson } = require("../../Utils");

let manifestJson, canvasJson, annotation, annotationPage, annotationBody;
const manifest = "/custom-annotations-manifest";
const customAnnotationsManifestUrl =
  "http://test.com/custom-annotations-manifest";

it("can build custom annotations collection", async () => {
  assert(await fileExists(manifest));
  return build(manifest, customAnnotationsManifestUrl);
}).timeout(1000); // should take less than a second

it("can find manifest index.json", async () => {
  const file = "/custom-annotations-manifest/index.json";
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
    assert(canvasJson.label["@none"][0] === "_commenting-text-with-format");
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
    assert(annotation.motivation === "commenting");
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
        customAnnotationsManifestUrl +
          "/index.json/annotations/commenting-text-with-format"
    );
  });

  it("has correct annotation body type", async () => {
    assert(annotationBody.type === "TextualBody");
  });

  it("has correct annotation body format", async () => {
    assert(annotationBody.format === "text/plain");
  });

  it("has correct annotation body value", async () => {
    assert(annotationBody.value === "This is a comment on the image");
  });
});

describe("commenting text with type", async () => {
  it("can find canvas", async () => {
    canvasJson = manifestJson.items[1];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(
      canvasJson.id === customAnnotationsManifestUrl + "/index.json/canvas/1"
    );
  });

  it("has correct canvas label", async () => {
    assert(canvasJson.label["@none"][0] === "_commenting-text-with-type");
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/1/annotationpage/0"
    );
  });

  it("has annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has correct annotation id", async () => {
    assert(
      annotation.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/1/annotation/0"
    );
  });

  it("has correct annotation motivation", async () => {
    assert(annotation.motivation === "commenting");
  });

  it("has correct annotation target", async () => {
    assert(
      annotation.target ===
        customAnnotationsManifestUrl + "/index.json/canvas/1"
    );
  });

  it("has an annotation body", async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
  });

  it("has correct annotation body id", async () => {
    assert(
      annotationBody.id ===
        customAnnotationsManifestUrl +
          "/index.json/annotations/commenting-text-with-type"
    );
  });

  it("has correct annotation body type", async () => {
    assert(annotationBody.type === "TextualBody");
  });

  it("has correct annotation body format", async () => {
    assert(annotationBody.format === "text/plain");
  });

  it("has correct annotation body value", async () => {
    assert(annotationBody.value === "This is a comment on the image");
  });
});

describe("commenting text without type and format", async () => {
  it("can find canvas", async () => {
    canvasJson = manifestJson.items[2];
    assert(canvasJson);
  });

  it("has correct canvas id", async () => {
    assert(
      canvasJson.id === customAnnotationsManifestUrl + "/index.json/canvas/2"
    );
  });

  it("has correct canvas label", async () => {
    assert(
      canvasJson.label["@none"][0] === "_commenting-text-without-type-format"
    );
  });

  it("has an annotation page", async () => {
    annotationPage = canvasJson.items[0];
    assert(annotationPage);
  });

  it("has the correct annotation page id", async () => {
    annotationPage = canvasJson.items[0];
    assert(
      annotationPage.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/2/annotationpage/0"
    );
  });

  it("has annotation", async () => {
    annotation = annotationPage.items[0];
    assert(annotation);
  });

  it("has correct annotation id", async () => {
    assert(
      annotation.id ===
        customAnnotationsManifestUrl + "/index.json/canvas/2/annotation/0"
    );
  });

  it("has correct annotation motivation", async () => {
    assert(annotation.motivation === "commenting");
  });

  it("has correct annotation target", async () => {
    assert(
      annotation.target ===
        customAnnotationsManifestUrl + "/index.json/canvas/2"
    );
  });

  it("has an annotation body", async () => {
    annotationBody = annotation.body;
    assert(annotationBody);
  });

  it("has correct annotation body id", async () => {
    assert(
      annotationBody.id ===
        customAnnotationsManifestUrl +
          "/index.json/annotations/commenting-text-without-type-format"
    );
  });

  it("has no annotation body type", async () => {
    assert(annotationBody.type === undefined);
  });

  it("has no annotation body format", async () => {
    assert(annotationBody.format === undefined);
  });

  it("has correct annotation body value", async () => {
    assert(annotationBody.value === "This is a comment on the image");
  });
});
/*
describe('json value with format', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[3];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/3');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_json-value-with-format');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/3/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/3/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'data');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/3');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_json-value-with-format/assets/data.json');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === undefined);
    });

    it('has correct annotation body format', async () => {
        assert(annotationBody.format === 'application/json');
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});

describe('json value without format', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[4];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/4');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_json-value-without-format');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/4/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/4/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'data');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/4');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_json-value-without-format/assets/data.json');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === undefined);
    });

    it('has no annotation body format', async () => {
        assert(annotationBody.format === undefined);
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});

describe('json value without motivation, type, or format', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[5];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/5');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_json-value-without-motivation-type-format');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/5/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/5/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'painting');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/5');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_json-value-without-motivation-type-format/assets/file.json');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === 'Text');
    });

    it('has correct annotation body format', async () => {
        assert(annotationBody.format === 'application/json');
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});

describe('painting gltf', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[6];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/6');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_painting-gltf');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/6/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/6/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'painting');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/6');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_painting-gltf/assets/file.gltf');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === 'PhysicalObject');
    });

    it('has correct annotation body format', async () => {
        assert(annotationBody.format === 'model/gltf+json');
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});

describe('painting jpg', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[7];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/7');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_painting-jpg');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/7/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/7/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'painting');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/7');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_painting-jpg/assets/file.jpg');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === 'Image');
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});

describe('painting three.js json with type', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[8];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/8');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_painting-threejs-json-with-type');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/8/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has only one annotation', async () => {
        assert(annotationPage.items.length === 1);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/8/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'painting');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/8');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === customAnnotationsManifestUrl + '/_painting-threejs-json-with-type/assets/file.json');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === 'PhysicalObject');
    });

    it('has correct annotation body format', async () => {
        assert(annotationBody.format === 'application/vnd.threejs+json');
    });

    it('has no annotation body value', async () => {
        assert(annotationBody.value === undefined);
    });

});
*/
