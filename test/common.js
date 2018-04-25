const { basename } = require('path');
const { build } = require('../index');
const { URL } = require('url');
const { Utils } = require('../Utils');
const assert = require('assert');
const fs = require('fs');
const jsonfile = require('jsonfile');
const mock = require('mock-fs');
const urljoin = require('url-join');

exports.basename = basename;
exports.build = build;
exports.URL = URL;
exports.Utils = Utils;
exports.assert = assert;
exports.fs = fs;
exports.jsonfile = jsonfile;
exports.mock = mock;
exports.urljoin = urljoin;

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
