const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

const manifest = "/readme-manifest";
const manifestUrl = "http://test.com/readme-manifest";

it("can build manifest", async () => {
  assert(await Utils.fileExists(manifest));
  return build(manifest, manifestUrl, true);
}).timeout(1000); // should take less than a second
