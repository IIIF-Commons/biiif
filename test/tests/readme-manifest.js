const { assert, build } = require("../common");
const { fileExists } = require("../../Utils");

const manifest = "/readme-manifest";
const manifestUrl = "http://test.com/readme-manifest";

it("can build manifest", async () => {
  assert(await fileExists(manifest));
  return build(manifest, manifestUrl);
}).timeout(1000); // should take less than a second
