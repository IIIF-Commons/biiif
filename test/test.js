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
        '/gh-collection': {
            'vertebra': {
                'thumb.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                'info.yml': 'label: Vertebra',
                '_vertebra': {
                    'diffuse.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'normal.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'vertebra.mtl': '...',
                    'vertebra.obj': '...'
                }
            }
        },
        '/manifests-collection': {
            'manifests.yml': require('./fixtures/manifests')
        },
        '/collection': {
            'info.yml': 'label: My Test Collection',
            'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'a_manifest': {
                'info.yml': 'label: A Manifest',
                'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                '_canvas': {
                    'info.yml': 'label: A Canvas',
                    'page_1.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
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
                        'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
                    }
                }
            },
            'manifests.yml': require('./fixtures/manifests'),
            'canvasperfile': {
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
                },
                '_png': {
                    'file.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
                }              
            },
            'filespercanvas': {
                '_files': {
                    'file.crt': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.drc': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.gltf': 'gltf',
                    'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.json': 'json',
                    'file.mp4': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.obj': 'obj',
                    'file.pdf': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.ply': 'ply',
                    'file.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                }        
            },
            'erroneousfile': {
                '_files': {
                    'file.abc': 'abc'
                } 
            }
        },
        '/custom-annotations-manifest': {
            '_commenting': {
                'commenting.yml': require('./fixtures/commenting')
            },
            '_painting': {
                'assets': { 
                    'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                'painting.yml': require('./fixtures/painting'),
                'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9])
            }
        }
    });
})

after(async () => {
    mock.restore();
})

let url, filePath, id, collectionJson, item, manifestJson, canvasJson, thumbnailJson, annotationPage, annotation, imageAnnotation, contentAnnotation;
const githubpagesUrl = 'https://username.github.io/uv-app-starter-fork/gh-collection';
const collectionUrl = 'http://test.com/collection';
const customAnnotationsManifestUrl = 'http://test.com/custom-annotations-manifest';

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

        url = new URL('https://edsilv.github.io/uv-app-starter/gh-collection/human_skull');
        filePath = 'c:/Users/edsilv/github/uv-app-starter/gh-collection/human_skull/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'https://edsilv.github.io/uv-app-starter/gh-collection/human_skull/thumb.png');

        url = new URL('dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection');
        filePath = 'c:/Users/edsilv/github/uv-app-starter/collection/human_skull/thumb.png';
        id = Utils.mergePaths(url, filePath);
        assert(id === 'dat://5d317729a67e4a1e5c28be9cf08493ec025a749a00ba4d9d4bf7ea6c439027ba/collection/human_skull/thumb.png');

    });

});

describe('build for gh-pages', async () => {
    
    it('can build collection', async () => {
        assert(fs.existsSync('/gh-collection'));
        build('/gh-collection', githubpagesUrl);
    }).timeout(1000); // should take less than a second

});

describe('gh-pages', async () => {
    
    it('can find collection index.json', async () => {
        const file = '/gh-collection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('has correct collection id', async () => {
        assert(collectionJson.id === githubpagesUrl + '/index.json');
    });

    it('has an item manifest', async () => {
        item = collectionJson.items[0];
        assert(item);
    });

    it('has correct item id', async () => {
        assert(item.id === 'https://username.github.io/uv-app-starter-fork/gh-collection/vertebra/index.json');
    });

    it('has item thumbnail', async () => {
        thumbnailJson = item.thumbnail;
        assert(thumbnailJson);
    });

    it('has correct item thumbnail id', async () => {
        const id = thumbnailJson[0].id;
        assert(id === 'https://username.github.io/uv-app-starter-fork/gh-collection/vertebra/thumb.jpg');
    });

});

describe('build for collection with no manifests', async () => {
    
    it('can build collection', async () => {
        assert(fs.existsSync('/manifests-collection'));
        build('/manifests-collection', collectionUrl);
    }).timeout(1000); // should take less than a second

});

describe('collection with no manifests', async () => {
    
    it('can find collection index.json', async () => {
        const file = '/manifests-collection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('has correct number of items', async () => {
        assert(collectionJson.items.length === 3);
    });

});

describe('build for collection', async () => {

    it('can build collection', async () => {
        assert(fs.existsSync('/collection'));
        build('/collection', collectionUrl);
    }).timeout(1000); // should take less than a second

});

describe('collection', async () => {

    it('can find collection index.json', async () => {
        const file = '/collection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
    });

    it('has correct collection id', async () => {
        assert(collectionJson.id === collectionUrl + '/index.json');
    });

    it('has correct collection label', async () => {
        assert(collectionJson.label['@none'][0] === 'My Test Collection');
    });

    it('has a collection thumbnail', async () => {
        thumbnailJson = collectionJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct collection thumbnail id', async () => {
        const id = urljoin(collectionUrl, 'thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has correct number of items', async () => {
        assert(collectionJson.items.length === 8);
    });

    it('has an item manifest', async () => {
        item = collectionJson.items[0];
        assert(item);
    });

    it('has correct item id', async () => {
        assert(item.id === 'http://test.com/collection/a_manifest/index.json');
    });

    it('has correct item label', async () => {
        assert(item.label['@none'][0] === 'A Manifest');
    });

    it('has item thumbnail', async () => {
        thumbnailJson = item.thumbnail;
        assert(thumbnailJson);
    });

    it('has a linked item manifest', async () => {
        item = collectionJson.items[4];
        assert(item);
    });

    it('has correct linked item id', async () => {
        assert(item.id === 'http://test.com/collection/linkedmanifest1/index.json');
    });

    it('has correct linked item label', async () => {
        assert(item.label['@none'][0] === 'Linked Manifest 1');
    });

    it('has linked item thumbnail', async () => {
        thumbnailJson = item.thumbnail;
        assert(thumbnailJson);
    });

    it('has correct linked item thumbnail id', async () => {
        assert(thumbnailJson[0].id === 'http://test.com/collection/linkedmanifest1/thumb.jpg');
    });

    it('has a linked item manifest', async () => {
        item = collectionJson.items[6];
        assert(item);
    });

    it('has correct linked item id', async () => {
        assert(item.id === 'http://test.com/collection/linkedmanifest3/index.json');
    });

    it('has correct linked item label', async () => {
        assert(item.label['@none'][0] === 'linkedmanifest3');
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
        assert(manifestJson.label['@none'][0] === 'A Manifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === collectionUrl + '/a_manifest/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === 'A Canvas');
    });

    it('has a canvas thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct canvas thumbnail id', async () => {
        const id = urljoin(collectionUrl, '/a_manifest/_canvas/thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === collectionUrl + '/a_manifest/index.json/canvas/0/annotationpage/0');
    });

    it('has an annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has an image annotation body', async () => {
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('has an annotation body', async () => {
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('has correct annotation id', async () => {
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
        assert(collectionJson.label['@none'][0] === 'My Test Subcollection');
    });

    it('has a collection thumbnail', async () => {
        thumbnailJson = collectionJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct collection thumbnail id', async () => {
        const id = urljoin(collectionUrl, '/subcollection/thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has a item manifest', async () => {
        item = collectionJson.items[0];
        assert(item);
    });

    it('has correct item id', async () => {
        assert(item.id === 'http://test.com/collection/subcollection/manifest/index.json');
    });

    it('has correct item label', async () => {
        assert(item.label['@none'][0] === 'My Test Submanifest');
    });

    it('has item thumbnail', async () => {
        thumbnailJson = item.thumbnail;
        assert(thumbnailJson);
    });

    it('has correct item thumbnail id', async () => {
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
        assert(manifestJson.label['@none'][0] === 'My Test Submanifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.items[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === collectionUrl + '/subcollection/manifest/index.json/canvas/0');
    });

    it('has correct canvas label', async () => {
        assert(canvasJson.label['@none'][0] === 'My Test Subcanvas');
    });

    it('has a thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct thumbnail id', async () => {
        const id = urljoin(collectionUrl, '/subcollection/manifest/_canvas/thumb.png');
        assert(thumbnailJson.id === id);
    });

    it('has an annotation page', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
    });

    it('has the correct annotation page id', async () => {
        annotationPage = canvasJson.items[0];
        assert(annotationPage.id === collectionUrl + '/subcollection/manifest/index.json/canvas/0/annotationpage/0');
    });

    it('has an annotation', async () => {
        annotation = annotationPage.items[0];
        assert(annotation);
    });

    it('has an image annotation body', async () => {
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('has an annotation body', async () => {
        imageAnnotation = annotation.body;
        assert(imageAnnotation);
    });

    it('image annotation has correct id', async () => {
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
        canvases = manifestJson.items;
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
        canvasHasContentAnnotations(canvases[9], ['file.png']);
    });

});

describe('Content Annotation Per Canvas', async () => {
    
    const manifest = '/collection/filespercanvas';
    let canvases;

    it('can find ' + manifest + ' index.json', async () => {
        const file = urljoin(manifest, 'index.json');
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        canvasJson = manifestJson.items[0];
    });

    it('has all content annotations', async () => {
        canvasHasContentAnnotations(canvasJson, ['file.crt', 'file.drc', 'file.gltf', 'file.jpg', 'file.json', 'file.mp4', 'file.obj', 'file.pdf', 'file.ply', 'file.png']);
    });

});

describe('Erroneous File', async () => {
    
    const manifest = '/collection/erroneousfile';
    let canvases;

    it('can find ' + manifest + ' index.json', async () => {
        const file = urljoin(manifest, 'index.json');
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        canvasJson = manifestJson.items[0];
    });

    it('has no content annotations', async () => {
        assert(canvasJson);        
        annotationPage = canvasJson.items[0];
        assert(annotationPage);
        assert(annotationPage.items.length === 0);
    });

});

describe('build for custom-annotations-manifest', async () => {

    it('can build custom annotations collection', async () => {
        assert(fs.existsSync('/custom-annotations-manifest'));
        build('/custom-annotations-manifest', customAnnotationsManifestUrl);
    }).timeout(1000); // should take less than a second

});

describe('custom-annotations-manifest', async () => {

    it('can find manifest index.json', async () => {
        const file = '/custom-annotations-manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
    });

    describe('commenting canvas', async () => {

        it('can find canvas', async () => {
            canvasJson = manifestJson.items[0];
            assert(canvasJson);
        });
    
        it('has correct canvas id', async () => {
            assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/0');
        });
    
        it('has correct canvas label', async () => {
            assert(canvasJson.label['@none'][0] === '_commenting');
        });

        it('has an annotation page', async () => {
            annotationPage = canvasJson.items[0];
            assert(annotationPage);
        });
    
        it('has the correct annotation page id', async () => {
            annotationPage = canvasJson.items[0];
            assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/0/annotationpage/0');
        });

        it('has annotation', async () => {
            annotation = annotationPage.items[0];
            assert(annotation);
        });

        it('has correct annotation id', async () => {
            assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/0/annotation/0');
        });
    
        it('has correct annotation motivation', async () => {
            assert(annotation.motivation === 'commenting');
        });
    
        it('has correct annotation target', async () => {
            assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/0');
        });
    
        it('has an annotation body', async () => {
            annotationBody = annotation.body;
            assert(annotationBody);
        });
    
        it('has correct annotation body id', async () => {
            assert(annotationBody.id === customAnnotationsManifestUrl + '/index.json/annotations/commenting');
        });
    
        it('has correct annotation body type', async () => {
            assert(annotationBody.type === 'TextualBody');
        });
    
        it('has correct annotation body value', async () => {
            assert(annotationBody.value === 'This is a comment on the image');
        });

    });

    describe('painting canvas', async () => {

        it('can find canvas', async () => {
            canvasJson = manifestJson.items[1];
            assert(canvasJson);
        });
    
        it('has correct canvas id', async () => {
            assert(canvasJson.id === customAnnotationsManifestUrl + '/index.json/canvas/1');
        });
    
        it('has correct canvas label', async () => {
            assert(canvasJson.label['@none'][0] === '_painting');
        });

        it('has an annotation page', async () => {
            annotationPage = canvasJson.items[0];
            assert(annotationPage);
        });
    
        it('has the correct annotation page id', async () => {
            annotationPage = canvasJson.items[0];
            assert(annotationPage.id === customAnnotationsManifestUrl + '/index.json/canvas/1/annotationpage/0');
        });

        it('has annotation', async () => {
            annotation = annotationPage.items[0];
            assert(annotation);
        });

        it('has only one annotation', async () => {
            assert(annotationPage.items.length === 1);
        });

        it('has correct id', async () => {
            assert(annotation.id === customAnnotationsManifestUrl + '/index.json/canvas/1/annotation/0');
        });
    
        it('has correct motivation', async () => {
            assert(annotation.motivation === 'painting');
        });
    
        it('has correct annotation target', async () => {
            assert(annotation.target === customAnnotationsManifestUrl + '/index.json/canvas/1');
        });
    
        it('has an annotation body', async () => {
            annotationBody = annotation.body;
            assert(annotationBody);
        });
    
        it('has correct annotation body id', async () => {
            assert(annotationBody.id === customAnnotationsManifestUrl + '/_painting/assets/file.jpg');
        });
    
        it('has correct annotation body type', async () => {
            assert(annotationBody.type === 'Image');
        });
    
        it('has correct annotation body value', async () => {
            assert(annotationBody.value === 'assets/file.jpg');
        });

    });

    /*
        - test that a custom painting annotation works, and means no other files are painted
        - 
    */

});

function canvasHasContentAnnotations(canvasJson, files) {

    assert(canvasJson);

    annotationPage = canvasJson.items[0];
    assert(annotationPage);

    files.forEach((file, index) => {

        annotation = annotationPage.items[index];
        assert(annotation);

        contentAnnotation = annotation.body;
        assert(contentAnnotation);

        assert(basename(contentAnnotation.id) === file);
    });
}
