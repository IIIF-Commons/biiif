const common = require("./common");
const mock = common.mock;

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

before(async () => {
  const blob = new Buffer([8, 6, 7, 5, 3, 0, 9]);
  const jpg = new Buffer(require("./fixtures/cat-jpg"));

  mock({
    "/thumbs-single-manifest": {
      "file.jpg": jpg,
    },
    "/files-only-manifest": {
      "file.glb": blob,
      "file.gltf": blob,
      "file.jpeg": jpg,
      "file.jpg": jpg,
      "file.png": jpg,
      "file.usdz": blob,
    },
    "/files-only-manifest-dat": {
      "file.gltf": blob,
      "file.jpg": jpg,
      "file.png": jpg,
    },
    "/files-only-collection": {
      "files-only-manifest": {
        "file.gltf": blob,
        "file.jpg": jpg,
        "file.png": jpg,
      },
    },
    "/vercel-manifest": {
      "_page-1": {
        "info.yml": "label: Page 1",
        "1.jpg": jpg,
      },
    },
    "/gh-collection": {
      "info.yml": "label: My Test Collection",
      "thumb.png": jpg,
      vertebra: {
        "thumb.jpg": jpg,
        "info.yml": "label: Vertebra",
        _vertebra: {
          "diffuse.png": jpg,
          "normal.png": jpg,
          "vertebra.mtl": "...",
          "vertebra.obj": "...",
        },
      },
    },
    "/manifests-collection": {
      "manifests.yml": require("./fixtures/manifests"),
    },
    "/collection": {
      "info.yml": "label: My Test Collection",
      "thumb.png": jpg,
      a_manifest: {
        "info.yml": "label: A Manifest",
        "thumb.png": jpg,
        _canvas: {
          "info.yml": "label: A Canvas",
          "page_1.jpg": jpg,
          "thumb.png": jpg,
        },
      },
      "manifests.yml": require("./fixtures/manifests"),
      "sub-collection": {
        "info.yml": "label: My Test Sub-collection",
        "thumb.png": jpg,
        b_manifest: {
          "thumb.png": jpg,
          "info.yml": "label: My Test Submanifest",
          _canvas: {
            "info.yml": "label: My Test Subcanvas",
            "page_1.jpg": jpg,
            "thumb.png": jpg,
          },
        },
      },
    },
    "/file-annotation-collection": {
      "canvas-per-file": {
        _crt: {
          "file.crt": blob,
        },
        _drc: {
          "file.drc": blob,
        },
        _gltf: {
          "file.gltf": "gltf",
        },
        _jpg: {
          "file.jpg": jpg,
        },
        _json: {
          "file.json": "json",
        },
        // _mp3: {
        //   "file.mp3": blob,
        // },
        // _mp4: {
        //   "file.mp4": blob,
        // },
        _obj: {
          "file.obj": "obj",
        },
        _pdf: {
          "file.pdf": blob,
        },
        _ply: {
          "file.ply": "ply",
        },
        _png: {
          "file.png": jpg,
        },
        _usdz: {
          "file.usdz": blob,
        },
      },
      "erroneous-file": {
        _files: {
          "file.abc": "abc",
        },
      },
      "files-per-canvas": {
        _files: {
          "file.crt": blob,
          "file.drc": blob,
          "file.gltf": "gltf",
          "file.jpg": jpg,
          "file.json": "json",
          // "file.mp3": blob,
          // "file.mp4": blob,
          "file.obj": "obj",
          "file.pdf": blob,
          "file.ply": "ply",
          "file.png": jpg,
          "file.usdz": blob,
        },
      },
    },
    "/sort-canvases-manifest": {
      "_a-canvas": {
        "file.jpg": jpg,
      },
      "_b-canvas": {
        "file.jpg": jpg,
      },
      "_c-canvas": {
        "file.jpg": jpg,
      },
      "_d-canvas": {
        "file.jpg": jpg,
      },
      "_e-canvas": {
        "file.jpg": jpg,
      },
      "_f-canvas": {
        "file.jpg": jpg,
      },
      "_g-canvas": {
        "file.jpg": jpg,
      },
      "_h-canvas": {
        "file.jpg": jpg,
      },
      "_i-canvas": {
        "file.jpg": jpg,
      },
      "_j-canvas": {
        "file.jpg": jpg,
      },
      "_k-canvas": {
        "file.jpg": jpg,
      },
    },
    "/sort-canvases-numeric-manifest": {
      "_page-1": {
        "file.jpg": jpg,
      },
      "_page-2": {
        "file.jpg": jpg,
      },
      "_page-3": {
        "file.jpg": jpg,
      },
      "_page-4": {
        "file.jpg": jpg,
      },
      "_page-5": {
        "file.jpg": jpg,
      },
      "_page-6": {
        "file.jpg": jpg,
      },
      "_page-7": {
        "file.jpg": jpg,
      },
      "_page-8": {
        "file.jpg": jpg,
      },
      "_page-9": {
        "file.jpg": jpg,
      },
      "_page-10": {
        "file.jpg": jpg,
      },
      "_page-11": {
        "file.jpg": jpg,
      },
      "_page-12": {
        "file.jpg": jpg,
      },
      "_page-13": {
        "file.jpg": jpg,
      },
      "_page-14": {
        "file.jpg": jpg,
      },
      "_page-15": {
        "file.jpg": jpg,
      },
      "_page-16": {
        "file.jpg": jpg,
      },
      "_page-17": {
        "file.jpg": jpg,
      },
      "_page-18": {
        "file.jpg": jpg,
      },
      "_page-19": {
        "file.jpg": jpg,
      },
      "_page-20": {
        "file.jpg": jpg,
      },
      "_page-21": {
        "file.jpg": jpg,
      },
    },
    "/sort-files-numeric-manifest": {
      "page1.jpg": jpg,
      "page2.jpg": jpg,
      "page3.jpg": jpg,
      "page4.jpg": jpg,
      "page5.jpg": jpg,
      "page6.jpg": jpg,
      "page7.jpg": jpg,
      "page8.jpg": jpg,
      "page9.jpg": jpg,
      "page10.jpg": jpg,
      "page11.jpg": jpg,
      "page12.jpg": jpg,
      "page13.jpg": jpg,
      "page14.jpg": jpg,
      "page15.jpg": jpg,
      "page16.jpg": jpg,
      "page17.jpg": jpg,
      "page18.jpg": jpg,
      "page19.jpg": jpg,
      "page20.jpg": jpg,
      "page21.jpg": jpg,
    },
    "/custom-annotations-manifest": {
      "_commenting-text-with-format": {
        "commenting-text-with-format.yml": require("./fixtures/commenting-text-with-format"),
      },
      "_commenting-text-with-type": {
        "commenting-text-with-type.yml": require("./fixtures/commenting-text-with-type"),
      },
      "_commenting-text-without-type-format": {
        "commenting-text-without-type-format.yml": require("./fixtures/commenting-text-without-type-format"),
      },
      "_json-value-with-format": {
        "json-value-with-format.yml": require("./fixtures/json-value-with-format"),
      },
      "_json-value-without-format": {
        "json-value-without-format.yml": require("./fixtures/json-value-without-format"),
      },
      "_json-value-without-motivation-type-format": {
        assets: {
          "file.json": "json",
        },
        "json-value-without-motivation-type-format.yml": require("./fixtures/json-value-without-motivation-type-format"),
      },
      "_painting-gltf": {
        assets: {
          "file.gltf": "gltf",
          "texture.png": jpg,
        },
        "painting-gltf.yml": require("./fixtures/painting-gltf"),
      },
      "_painting-jpg": {
        assets: {
          "file.jpg": jpg,
        },
        "painting-jpg.yml": require("./fixtures/painting-jpg"),
        "file.jpg": jpg,
      },
      "_painting-threejs-json-with-type": {
        assets: {
          "file.json": "json",
          "texture.png": jpg,
        },
        "painting-threejs-json-with-type.yml": require("./fixtures/painting-threejs-json-with-type"),
      },
    },
    "/generate-thumbs-manifest": {
      "_page-1": {
        "file.jpg": jpg,
      },
      "_page-2": {
        "file.jpg": jpg,
      },
    },
    "/generate-thumbs-dat-manifest": {
      "_page-1": {
        "file.jpg": jpg,
      },
      "_page-2": {
        "file.jpg": jpg,
      },
    },
    "/canvas-with-dimensions-manifest": {
      "_canvas-with-dimensions": {
        assets: {
          "file.jpg": jpg,
        },
        "painting-jpg-with-xywh.yml": require("./fixtures/painting-jpg-with-xywh"),
        "info.yml": require("./fixtures/dimensions-info"),
      },
    },
    "/canvas-with-presentation-3-image-service-manifest": {
      "_canvas-with-presentation-3-image-service": {
        "presentation-3-image-service.yml": require("./fixtures/presentation-3-image-service"),
      },
    },
    "/behavior-paged-manifest": {
      "info.yml": require("./fixtures/behavior-paged"),
      "_page-1": {
        "file.jpg": jpg,
      },
      "_page-2": {
        "file.jpg": jpg,
      },
    },
    "/multiple-behavior-manifest": {
      "info.yml": require("./fixtures/multiple-behavior"),
      "_page-1": {
        "file.jpg": jpg,
      },
      "_page-2": {
        "file.jpg": jpg,
      },
    },
    "/image-dimensions-manifest": {
      "_page-1": {
        "file.jpg": jpg,
      },
    },
    "/external-resource-annotation-manifest": {
      _platypus: {
        "platypus.yml": require("./fixtures/external-resource-annotation"),
      },
    },
    "/canvas-label-annotation-manifest": {
      "_canvas-label-annotation": {
        assets: {
          "file.jpg": jpg,
        },
        "label.yml": require("./fixtures/canvas-label-annotation"),
      },
    },
    "/readme-manifest": {
      "README.md": "readme contents",
    },
    "/epub-collection": {
      "alice-in-wonderland": {
        "_alice-in-wonderland": {
          "alice-in-wonderland.yml": require("./fixtures/epub-external-resource-annotation"),
        },
      },
      "cc-shared-culture": {
        "_cc-shared-culture": {
          "cc-shared-culture.epub": blob,
        },
      },
    },
  });
});

after(async () => {
  mock.restore();
});

importTest("utils", "./tests/utils");
importTest("url", "./tests/url");
importTest("do-promises-work", "./tests/do-promises-work");
importTest("thumbs-single-manifest", "./tests/thumbs-single-manifest");
importTest("thumbs-single-manifest-dat", "./tests/thumbs-single-manifest-dat");
importTest("files-only-manifest", "./tests/files-only-manifest");
importTest("files-only-manifest-dat", "./tests/files-only-manifest-dat");
importTest("files-only-collection", "./tests/files-only-collection");
importTest("vercel-manifest", "./tests/vercel-manifest");
importTest("gh-pages", "./tests/gh-pages");
importTest("collection-no-manifests", "./tests/collection-no-manifests");
importTest("collection", "./tests/collection");
importTest("file-annotation-collection", "./tests/file-annotation-collection");
importTest("sort-canvases-manifest", "./tests/sort-canvases-manifest");
importTest(
  "sort-canvases-numeric-manifest",
  "./tests/sort-canvases-numeric-manifest"
);
importTest(
  "sort-files-numeric-manifest",
  "./tests/sort-files-numeric-manifest"
);
importTest(
  "custom-annotations-manifest",
  "./tests/custom-annotations-manifest"
);
importTest("generate-thumbs-manifest", "./tests/generate-thumbs-manifest");
importTest(
  "generate-thumbs-dat-manifest",
  "./tests/generate-thumbs-dat-manifest"
);
importTest(
  "generate-thumbs-http-gateway-dat-manifest",
  "./tests/generate-thumbs-http-gateway-dat-manifest"
);
importTest("dat-gateway", "./tests/dat-gateway");
importTest(
  "canvas-with-dimensions-manifest",
  "./tests/canvas-with-dimensions-manifest"
);
importTest(
  "canvas-with-presentation-3-image-service-manifest",
  "./tests/canvas-with-presentation-3-image-service-manifest"
);
importTest("behavior-paged-manifest", "./tests/behavior-paged-manifest");
importTest("multiple-behavior-manifest", "./tests/multiple-behavior-manifest");
importTest("image-dimensions-manifest", "./tests/image-dimensions-manifest");
importTest(
  "external-resource-annotation-manifest",
  "./tests/external-resource-annotation-manifest"
);
importTest(
  "canvas-label-annotation-manifest",
  "./tests/canvas-label-annotation-manifest"
);
importTest("readme-manifest", "./tests/readme-manifest");
importTest("epub-collection", "./tests/epub-collection");
