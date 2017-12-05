const { basename } = require('path');
const { build } = require('../index');
const { URL } = require('url');
const { Utils } = require('../Utils');
const assert = require('assert');
const fs = require('fs');
const jsonfile = require('jsonfile');
const mock = require('mock-fs');
const urljoin = require('url-join');

before(async () => {
    mock({
        '/collection': {
            'info.yml': 'label: My Test Collection',
            'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'a_manifest': {
                'info.yml': 'label: A Manifest',
                'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                '_canvas': {
                    'info.yml': 'label: A Canvas',
                    'page_1.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                }
            },
            'subcollection': {
                'info.yml': 'label: My Test Subcollection',
                'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                'manifest': {
                    'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
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

let url, filePath, id, collectionJson, member, manifestJson, canvasJson, thumbnailJson, annotationPage, annotation, imageAnnotation, contentAnnotation;
const collectionUrl = 'http://test.com/collection';

describe('utils', async () => {

    it('correctly creates thumbnail ids', async () => {

        url = new URL('http://test.com/manifest');
        filePath = 'c:/user/documents/manifest/_canvas/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://test.com/manifest/_canvas/thumb.png');

        url = new URL('http://test.com/manifest');
        filePath = 'c:/manifest/_canvas/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://test.com/manifest/_canvas/thumb.png');

        url = new URL('http://test.com/manifest');
        filePath = 'c:\\manifest\\_canvas\\thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://test.com/manifest/_canvas/thumb.png');

        url = new URL('http://test.com/collection/manifest');
        filePath = 'c:/user/documents/collection/manifest/_canvas/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://test.com/collection/manifest/_canvas/thumb.png');

        url = new URL('http://test.com/collection/subcollection/sub_collection/subcollection/manifest');
        filePath = 'c:/user/documents/collection/subcollection/sub_collection/subcollection/manifest/_canvas/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://test.com/collection/subcollection/sub_collection/subcollection/manifest/_canvas/thumb.png');

        url = new URL('http://localhost:8888/collection/subcollection/sub_collection/subcollection/manifest');
        filePath = 'c:/user/documents/github/collection/subcollection/sub_collection/subcollection/manifest/_canvas/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'http://localhost:8888/collection/subcollection/sub_collection/subcollection/manifest/_canvas/thumb.png');

        url = new URL('https://edsilv.github.io/uv-app-starter/content/human_skull');
        filePath = 'c:/Users/edsilv/github/uv-app-starter/content/human_skull/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'https://edsilv.github.io/uv-app-starter/content/human_skull/thumb.png');

    });

});

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

    it('has correct collection id', async () => {
        assert(collectionJson.id === collectionUrl + '/index.json');
    });

    it('has correct collection label', async () => {
        assert(collectionJson.label === 'My Test Collection');
    });

    it('has a collection thumbnail', async () => {
        thumbnailJson = collectionJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct collection thumbnail id', async () => {
        const id = urljoin(collectionUrl, 'thumb.png');
        console.log('expected', id);
        console.log('actual', thumbnailJson.id);
        assert(thumbnailJson.id === id);
    });

    it('has a member manifest', async () => {
        member = collectionJson.members[0];
        assert(member);
    });

    it('has correct member id', async () => {
        assert(member.id === 'http://test.com/collection/a_manifest/index.json');
    });

    it('has correct member label', async () => {
        assert(member.label === 'A Manifest');
    });

    it('has member thumbnail', async () => {
        thumbnailJson = member.thumbnail;
        assert(thumbnailJson);
    });

    it('has correct member thumbnail id', async () => {
        assert(thumbnailJson[0].id === 'http://test.com/collection/a_manifest/thumb.png');
    });

    it('can find manifest index.json', async () => {
        const file = '/collection/a_manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    it('has correct manifest id', async () => {
        assert(manifestJson.id === collectionUrl + '/a_manifest/index.json');
    });

    it('has correct manifest label', async () => {
        assert(manifestJson.label === 'A Manifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.sequences[0].canvases[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === collectionUrl + '/a_manifest/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label === 'A Canvas');
    });

    it('has a canvas thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct canvas thumbnail id', async () => {
        const id = urljoin(collectionUrl, '/a_manifest/_canvas/thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has an annotation page', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () =>{
        annotationPage = canvasJson.content[0];
        assert(annotationPage.id === collectionUrl + '/a_manifest/index.json/canvas/0/annotationpage/0');
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
        assert(imageAnnotation.id === collectionUrl + '/a_manifest/_canvas/page_1.jpg');
    });

});

describe('sub collection', async () => {

    it('can find collection index.json', async () => {
        const file = '/collection/subcollection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('has correct collection id', async () => {
        assert(collectionJson.id === collectionUrl + '/subcollection/index.json');
    });

    it('has correct collection label', async () => {
        assert(collectionJson.label === 'My Test Subcollection');
    });

    it('has a collection thumbnail', async () => {
        thumbnailJson = collectionJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct collection thumbnail id', async () => {
        const id = urljoin(collectionUrl, '/subcollection/thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has a member manifest', async () => {
        member = collectionJson.members[0];
        assert(member);
    });

    it('has correct member id', async () => {
        assert(member.id === 'http://test.com/collection/subcollection/manifest/index.json');
    });

    it('has correct member label', async () => {
        assert(member.label === 'My Test Submanifest');
    });

    it('has member thumbnail', async () => {
        thumbnailJson = member.thumbnail;
        assert(thumbnailJson);
    });

    it('has correct member thumbnail id', async () => {
        assert(thumbnailJson[0].id === 'http://test.com/collection/subcollection/manifest/thumb.png');
    });

    it('can find manifest index.json', async () => {
        const file = '/collection/subcollection/manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    it('has correct manifest id', async () => {
        assert(manifestJson.id === collectionUrl + '/subcollection/manifest/index.json');
    });

    it('has correct manifest label', async () => {
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
        const id = urljoin(collectionUrl, '/subcollection/manifest/_canvas/thumb.png');
        assert(thumbnailJson.id === id);
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
