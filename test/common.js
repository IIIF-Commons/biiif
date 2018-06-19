const { basename } = require('path');
const { build, JIMP_ENABLED } = require('../index');
const { URL } = require('url');
const { Utils } = require('../Utils');
const assert = require('assert');
const config = require('../config');
const fs = require('fs');
const jsonfile = require('jsonfile');
const mock = require('mock-fs');
const urljoin = require('url-join');

exports.assert = assert;
exports.basename = basename;
exports.build = build;
exports.config = config;
exports.fs = fs;
exports.jsonfile = jsonfile;
exports.mock = mock;
exports.URL = URL;
exports.urljoin = urljoin;
exports.Utils = Utils;

exports.canvasHasContentAnnotations = (canvasJson, files) => {

    assert(canvasJson);

    const annotationPage = canvasJson.items[0];
    assert(annotationPage);

    files.forEach((file, index) => {

        const annotation = annotationPage.items[index];
        assert(annotation);

        const contentAnnotation = annotation.body;
        assert(contentAnnotation);

        assert(basename(contentAnnotation.id) === file);
    });
}
