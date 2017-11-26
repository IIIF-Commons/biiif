const assert = require('assert');
const { build } = require('../index');
const mock = require('mock-fs');
const fs = require('fs');
const jsonfile = require('jsonfile');

before(async () => {
    mock({
        '/collection': {
            'info.yml': 'label: My Test Collection',
            'manifest': {
                'info.yml': 'label: My Test Manifest',
                '_canvas': {
                    'info.yml': 'label: My Test Canvas',
                    'page_1.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                }
            },
            'subcollection': {
                'info.yml': 'label: My Test Subcollection',
                'manifest': {
                    'info.yml': 'label: My Test Submanifest',
                    '_canvas': {
                        'info.yml': 'label: My Test Subcanvas',
                        'page_1.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                        'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    }
                }
            },
            "abc": {
                '_canvas': {
                    'file.abc': 'abc'
                }
            },
            "obj": {
                '_canvas': {
                    'file.obj': 'obj'
                }
            },
            "ply": {
                '_canvas': {
                    'file.ply': 'ply'
                }
            },
            "pdf": {
                '_canvas': {
                    'file.pdf': 'pdf'
                }
            },
            "mp4": {
                '_canvas': {
                    'file.mp4': 'mp4'
                }
            },
            "gltf": {
                '_canvas': {
                    'file.gltf': 'gltf'
                }
            },
            "json": {
                '_canvas': {
                    'file.json': 'json'
                }
            },
            "crt": {
                '_canvas': {
                    'file.crt': 'crt'
                }
            },
            "drc": {
                '_canvas': {
                    'file.drc': 'drc'
                }
            }
        }
    });
})

after(async () => {
    mock.restore();
})

let collectionJson;
let manifestJson;
let canvasJson;
let thumbnailJson;
let annotationPage;
let annotation;
let imageAnnotation;
let contentAnnotation;
const collectionUrl = 'http://test.com/collection'

describe('build', async () => {

    it('can build collection', async () => {
        assert(fs.existsSync('/collection'));
        build('/collection', collectionUrl);
    }).timeout(1000); // should take less than a second

});

describe('top collection', async () => {

    it('can find collection index.json', async () => {
        const file = '/collection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('can find manifest index.json', async () => {
        const file = '/collection/manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    it('has correct collection id', async () => {
        assert(collectionJson.id === collectionUrl + '/index.json');
    });

    it('has correct collection label', async () => {
        assert(collectionJson.label === 'My Test Collection');
    });

    it('has correct manifest id', async () => {
        assert(manifestJson.id === collectionUrl + '/manifest/index.json');
    });

    it('has correct manifest label', async () => {
        assert(manifestJson.label === 'My Test Manifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.sequences[0].canvases[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === collectionUrl + '/manifest/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label === 'My Test Canvas');
    });

    it('has a thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct thumbnail id', async () => {
        assert(thumbnailJson.id === collectionUrl + '/manifest/_canvas/thumb.png');
    });

    it('has an annotation page', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage.id === collectionUrl + '/manifest/index.json/canvas/0/annotationpage/0');
    });

    it('has an annotation', async () =>{
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has an image annotation body', async () =>{
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('has an annotation body', async () =>{
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('image annotation has correct id', async () =>{
        assert(imageAnnotation.id === collectionUrl + '/manifest/_canvas/page_1.jpg');
    });

});

describe('sub collection', async () => {

    it('can find subcollection index.json', async () => {
        const file = '/collection/subcollection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('has correct subcollection id', async () => {
        assert(collectionJson.id === collectionUrl + '/subcollection/index.json');
    });

    it('has correct subcollection label', async () => {
        assert(collectionJson.label === 'My Test Subcollection');
    });

    it('can find submanifest index.json', async () => {
        const file = '/collection/subcollection/manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    it('has correct submanifest id', async () => {
        assert(manifestJson.id === collectionUrl + '/subcollection/manifest/index.json');
    });

    it('has correct submanifest label', async () => {
        assert(manifestJson.label === 'My Test Submanifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.sequences[0].canvases[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === collectionUrl + '/subcollection/manifest/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label === 'My Test Subcanvas');
    });

    it('has a thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct thumbnail id', async () => {
        assert(thumbnailJson.id === collectionUrl + '/subcollection/manifest/_canvas/thumb.png');
    });

    it('has an annotation page', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage.id === collectionUrl + '/subcollection/manifest/index.json/canvas/0/annotationpage/0');
    });

    it('has an annotation', async () =>{
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has an image annotation body', async () =>{
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('has an annotation body', async () =>{
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('image annotation has correct id', async () =>{
        assert(imageAnnotation.id === collectionUrl + '/subcollection/manifest/_canvas/page_1.jpg');
    });
});

describe('Content annotations', async () => {
    testContentAnnotation('abc', collectionUrl + '/abc/_canvas/file.abc', true);
    testContentAnnotation('obj', collectionUrl + '/obj/_canvas/file.obj');
    testContentAnnotation('ply', collectionUrl + '/ply/_canvas/file.ply');
    testContentAnnotation('pdf', collectionUrl + '/pdf/_canvas/file.pdf');
    testContentAnnotation('mp4', collectionUrl + '/mp4/_canvas/file.mp4');
    testContentAnnotation('gltf', collectionUrl + '/gltf/_canvas/file.gltf');
    testContentAnnotation('json', collectionUrl + '/json/_canvas/file.json');
    testContentAnnotation('crt', collectionUrl + '/crt/_canvas/file.crt');
    testContentAnnotation('drc', collectionUrl + '/drc/_canvas/file.drc');
});

function testContentAnnotation(type, id, shouldNotExist) {

    it('can find ' + type + ' index.json', async () => {
        const file = '/collection/' + type + '/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    it('can find ' + type + ' canvas', async () => {
        canvasJson = manifestJson.sequences[0].canvases[0];
        assert(canvasJson);
    });

    it('has an annotation page', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage);
    });

    it('has an annotation', async () =>{
        if (shouldNotExist) {
            annotation = null;
            assert(annotationPage.items.length === 0);
        } else {
            annotation = annotationPage.items[0];
            assert(annotation);
        }        
    });

    it('has a ' + type + ' annotation body', async () =>{
        if (shouldNotExist) {
            assert(annotation === null);
        } else {
            contentAnnotation = annotation.body;
            assert(contentAnnotation);
        }
    });

    it('content annotation has correct id', async () =>{
        if (shouldNotExist) {
            assert(annotation === null);
        } else {
            assert(contentAnnotation.id === id);
        }
    });
}