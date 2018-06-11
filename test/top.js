const common = require('./common');
const assert = common.assert;
const basename = common.basename;
const build = common.build;
const fs = common.fs;
const jsonfile = common.jsonfile;
const mock = common.mock;
const URL = common.URL;
const urljoin = common.urljoin;
const Utils = common.Utils;

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

before(async () => {
    mock({
        '/files-only-manifest': {
            'file.gltf': 'gltf',
            'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'file.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
        },
        '/files-only-manifest-dat': {
            'file.gltf': 'gltf',
            'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'file.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
        },
        '/files-only-collection': {
            'files-only-manifest': {
                'file.gltf': 'gltf',
                'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                'file.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
            }
        },
        '/gh-collection': {
            'info.yml': 'label: My Test Collection',
            'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
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
            'sub-collection': {
                'info.yml': 'label: My Test Sub-collection',
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
            'canvas-per-file': {
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
            'files-per-canvas': {
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
            'erroneous-file': {
                '_files': {
                    'file.abc': 'abc'
                } 
            }
        },
        '/custom-annotations-manifest': {
            '_commenting-text-with-format': {
                'commenting-text-with-format.yml': require('./fixtures/commenting-text-with-format')
            },
            '_commenting-text-with-type': {
                'commenting-text-with-type.yml': require('./fixtures/commenting-text-with-type')
            },
            '_commenting-text-without-type-format': {
                'commenting-text-without-type-format.yml': require('./fixtures/commenting-text-without-type-format')
            },
            '_json-value-with-format': {
                'json-value-with-format.yml': require('./fixtures/json-value-with-format')
            },
            '_json-value-without-format': {
                'json-value-without-format.yml': require('./fixtures/json-value-without-format')
            },
            '_json-value-without-motivation-type-format': {
                'assets': { 
                    'file.json': 'json'
                },
                'json-value-without-motivation-type-format.yml': require('./fixtures/json-value-without-motivation-type-format')
            },
            '_painting-gltf': {
                'assets': { 
                    'file.gltf': 'gltf',
                    'texture.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                'painting-gltf.yml': require('./fixtures/painting-gltf')
            },
            '_painting-jpg': {
                'assets': { 
                    'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                'painting-jpg.yml': require('./fixtures/painting-jpg'),
                'file.jpg': new Buffer([8, 6, 7, 5, 3, 0, 9])
            },
            '_painting-threejs-json-with-type': {
                'assets': { 
                    'file.json': 'json',
                    'texture.png': new Buffer([8, 6, 7, 5, 3, 0, 9])
                },
                'painting-threejs-json-with-type.yml': require('./fixtures/painting-threejs-json-with-type')
            }
        },
        '/generate-thumbs-manifest': {
            '_canvas-without-thumb': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        }
    });
})

after(async () => {
    mock.restore();
})

importTest('utils', './tests/utils');
importTest('do-promises-work', './tests/do-promises-work');
importTest('files-only-manifest', './tests/files-only-manifest');
importTest('files-only-manifest-dat', './tests/files-only-manifest-dat');
importTest('files-only-collection', './tests/files-only-collection');
importTest('gh-pages', './tests/gh-pages');
// importTest('collection-no-manifests', './tests/collection-no-manifests');
// importTest('collection', './tests/collection');
// importTest('canvas-per-content-annotation', './tests/canvas-per-content-annotation');
// importTest('content-annotation-per-canvas', './tests/content-annotation-per-canvas');
// importTest('erroneous-file', './tests/erroneous-file');
// importTest('custom-annotations-manifest', './tests/custom-annotations-manifest');
// importTest('generate-thumbs-manifest', './tests/generate-thumbs-manifest');
// importTest('dat-gateway', './tests/dat-gateway');