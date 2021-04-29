const common = require("../common");
const assert = common.assert;
const build = common.build;
const { fileExists, readJson } = require("../../Utils");

const manifest = "/readme-manifest";
const manifestUrl = "http://test.com/readme-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second
