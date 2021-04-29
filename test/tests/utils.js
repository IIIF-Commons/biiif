const { assert, URL } = require("../common");
const { mergePaths } = require("../../Utils");

let url, filePath, id;

it("correctly creates thumbnail ids", async () => {
  url = new URL("http://test.com/manifest");
  filePath = "c:/user/documents/manifest/_canvas/thumb.png";
  id = mergePaths(url, filePath);
  assert(id === "http://test.com/manifest/_canvas/thumb.png");

  url = new URL("http://test.com/manifest");
  filePath = "c:/manifest/_canvas/thumb.png";
  id = mergePaths(url, filePath);
  assert(id === "http://test.com/manifest/_canvas/thumb.png");

  url = new URL("http://test.com/manifest");
  filePath = "c:\\manifest\\_canvas\\thumb.png";
  id = mergePaths(url, filePath);
  assert(id === "http://test.com/manifest/_canvas/thumb.png");

  url = new URL("http://test.com/collection/manifest");
  filePath = "c:/user/documents/collection/manifest/_canvas/thumb.png";
  id = mergePaths(url, filePath);
  assert(id === "http://test.com/collection/manifest/_canvas/thumb.png");

  url = new URL(
    "http://test.com/collection/sub-collection/sub_collection/sub-collection/manifest"
  );
  filePath =
    "c:/user/documents/collection/sub-collection/sub_collection/sub-collection/manifest/_canvas/thumb.png";
  id = mergePaths(url, filePath);
  assert(
    id ===
      "http://test.com/collection/sub-collection/sub_collection/sub-collection/manifest/_canvas/thumb.png"
  );

  url = new URL(
    "http://localhost:8888/collection/sub-collection/sub_collection/sub-collection/manifest"
  );
  filePath =
    "c:/user/documents/github/collection/sub-collection/sub_collection/sub-collection/manifest/_canvas/thumb.png";
  id = mergePaths(url, filePath);
  assert(
    id ===
      "http://localhost:8888/collection/sub-collection/sub_collection/sub-collection/manifest/_canvas/thumb.png"
  );

  url = new URL(
    "https://edsilv.github.io/uv-app-starter/gh-collection/human_skull"
  );
  filePath =
    "c:/Users/edsilv/github/uv-app-starter/gh-collection/human_skull/thumb.png";
  id = mergePaths(url, filePath);
  assert(
    id ===
      "https://edsilv.github.io/uv-app-starter/gh-collection/human_skull/thumb.png"
  );

  url = new URL(
    "dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection"
  );
  filePath =
    "c:/Users/edsilv/github/uv-app-starter/collection/human_skull/thumb.png";
  id = mergePaths(url, filePath);
  assert(
    id ===
      "dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection/human_skull/thumb.png"
  );

  url = new URL(
    "dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection"
  );
  filePath =
    "c:/Users/edsilv/github/uv-app-starter/collection/human_skull/thumb.png";
  id = mergePaths(url, filePath);
  assert(
    id ===
      "dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection/human_skull/thumb.png"
  );

  // url = new URL('http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772');
  // filePath = 'C://Users/edsilv/github/edsilv/biiif-workshop/collection/_abyssinian/thumb.jpeg';
  // id = mergePaths(url, filePath, 'collection');
  // assert(id === 'http://174.138.105.19:3000/0cd3f6a6b3b11700b299f70fe4dbc054d83590676ec18d7d623ccd31791fc772/_abyssinian/thumb.jpeg');
});
