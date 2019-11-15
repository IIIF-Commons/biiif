const common = require("../common");
const assert = common.assert;
const build = common.build;
const Utils = common.Utils;

let manifestJson, canvasJson, annotation, annotationPage, annotationBody;
const manifest = '/epub-collection';
const epubCollectionUrl = 'http://test.com/epub-collection';

it('can build epub collection', async () => {
    assert(await Utils.fileExists(manifest));
    return build(manifest, epubCollectionUrl);
}).timeout(1000); // should take less than a second

it('can find manifest index.json', async () => {
    const file = '/epub-collection/index.json';
    assert(await Utils.fileExists(file));
    manifestJson = await Utils.readJson(file);
});

describe('painting opf', async () => {

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === epubCollectionUrl + '/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === '_alice-in-wonderland');
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === epubCollectionUrl + '/index.json/canvas/0/annotationpage/0');
    });

    it('has annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has correct annotation id', async () => {
        assert(annotation.id === epubCollectionUrl + '/index.json/canvas/0/annotation/0');
    });

    it('has correct annotation motivation', async () => {
        assert(annotation.motivation === 'painting');
    });

    it('has correct annotation target', async () => {
        assert(annotation.target === epubCollectionUrl + '/index.json/canvas/0');
    });

    it('has an annotation body', async () => {
        annotationBody = annotation.body;
        assert(annotationBody);
    });

    it('has correct annotation body id', async () => {
        assert(annotationBody.id === 'https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf');
    });

    it('has correct annotation body type', async () => {
        assert(annotationBody.type === 'EBook');
    });

    it('has correct annotation body format', async () => {
        assert(annotationBody.format === 'application/oebps-package+xml');
    });

});