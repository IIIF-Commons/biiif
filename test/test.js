const { build } = require('../index');
const { basename } = require('path');
const assert = require('assert');
const fs = require('fs');
const jsonfile = require('jsonfile');
const mock = require('mock-fs');
const urljoin = require('url-join');

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
            "canvasperfile": {
                '_crt': {
                    'file.crt': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                '_drc': {
                    'file.drc': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                '_gltf': {
                    'file.gltf': 'gltf'
                },
                '_jpg': {
                    'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                '_json': {
                    'file.json': 'json'
                },
                '_mp4': {
                    'file.mp4': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                '_obj': {
                    'file.obj': 'obj'
                },
                '_pdf': {
                    'file.pdf': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                '_ply': {
                    'file.ply': 'ply'
                }                
            },
            "filespercanvas": {
                "_files": {
                    'file.crt': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.drc': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.gltf': 'gltf',
                    'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.json': 'json',
                    'file.mp4': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.obj': 'obj',
                    'file.pdf': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.ply': 'ply' 
                }        
            },
            "erroneousfile": {
                "_files": {
                    'file.abc': 'abc'
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
const collectionUrl = 'http://test.com/collection';

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

describe('Canvas Per Content Annotation', async () => {

    const manifest = '/collection/canvasperfile';
    let canvases;

    it('can find ' + manifest + ' index.json', async () => {
        const file = urljoin(manifest, 'index.json');
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        canvases = manifestJson.sequences[0].canvases;
    });

    it('has all content annotations', async () => {
        canvasHasContentAnnotations(canvases[0], ['file.crt']);
        canvasHasContentAnnotations(canvases[1], ['file.drc']);
        canvasHasContentAnnotations(canvases[2], ['file.gltf']);
        canvasHasContentAnnotations(canvases[3], ['file.jpg']);
        canvasHasContentAnnotations(canvases[4], ['file.json']);
        canvasHasContentAnnotations(canvases[5], ['file.mp4']);
        canvasHasContentAnnotations(canvases[6], ['file.obj']);
        canvasHasContentAnnotations(canvases[7], ['file.pdf']);
        canvasHasContentAnnotations(canvases[8], ['file.ply']);
    });

});

describe('Content Annotation Per Canvas', async () => {
    
    const manifest = '/collection/filespercanvas';
    let canvases;

    it('can find ' + manifest + ' index.json', async () => {
        const file = urljoin(manifest, 'index.json');
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        canvasJson = manifestJson.sequences[0].canvases[0];
    });

    it('has all content annotations', async () => {
        canvasHasContentAnnotations(canvasJson, ['file.crt', 'file.drc', 'file.gltf', 'file.jpg', 'file.json', 'file.mp4', 'file.obj', 'file.pdf', 'file.ply']);
    });

});

describe('Erroneous File', async () => {
    
    const manifest = '/collection/erroneousfile';
    let canvases;

    it('can find ' + manifest + ' index.json', async () => {
        const file = urljoin(manifest, 'index.json');
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        canvasJson = manifestJson.sequences[0].canvases[0];
    });

    it('has no content annotations', async () => {
        assert(canvasJson);        
        annotationPage = canvasJson.content[0];
        assert(annotationPage);
        assert(annotationPage.items.length === 0);
    });

});

function canvasHasContentAnnotations(canvasJson, files) {

    assert(canvasJson);

    annotationPage = canvasJson.content[0];
    assert(annotationPage);

    files.forEach((file, index) => {

        annotation = annotationPage.items[index];
        assert(annotation);

        contentAnnotation = annotation.body;
        assert(contentAnnotation);

        assert(basename(contentAnnotation.id) === file);
    });
}