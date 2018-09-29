const common = require('./common');
const config = common.config;
const mock = common.mock;

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

before(async () => {
    mock({
        '/thumbs-single-manifest': {
            'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
        },
        '/files-only-manifest': {
            'file.gltf': 'gltf',
            'file.jpeg': new Buffer(require('./fixtures/cat-jpg')),
            'file.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'file.png': new Buffer(require('./fixtures/cat-jpg'))
        },
        '/files-only-manifest-dat': {
            'file.gltf': 'gltf',
            'file.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'file.png': new Buffer(require('./fixtures/cat-jpg'))
        },
        '/files-only-collection': {
            'files-only-manifest': {
                'file.gltf': 'gltf',
                'file.jpg': new Buffer(require('./fixtures/cat-jpg')),
                'file.png': new Buffer(require('./fixtures/cat-jpg'))
            }
        },
        '/gh-collection': {
            'info.yml': 'label: My Test Collection',
            'thumb.png': new Buffer(require('./fixtures/cat-jpg')),
            'vertebra': {
                'thumb.jpg': new Buffer(require('./fixtures/cat-jpg')),
                'info.yml': 'label: Vertebra',
                '_vertebra': {
                    'diffuse.png': new Buffer(require('./fixtures/cat-jpg')),
                    'normal.png': new Buffer(require('./fixtures/cat-jpg')),
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
            'thumb.png': new Buffer(require('./fixtures/cat-jpg')),
            'a_manifest': {
                'info.yml': 'label: A Manifest',
                'thumb.png': new Buffer(require('./fixtures/cat-jpg')),
                '_canvas': {
                    'info.yml': 'label: A Canvas',
                    'page_1.jpg': new Buffer(require('./fixtures/cat-jpg')),
                    'thumb.png': new Buffer(require('./fixtures/cat-jpg'))
                }
            },
            'manifests.yml': require('./fixtures/manifests'),
            'sub-collection': {
                'info.yml': 'label: My Test Sub-collection',
                'thumb.png': new Buffer(require('./fixtures/cat-jpg')),
                'manifest': {
                    'thumb.png': new Buffer(require('./fixtures/cat-jpg')),
                    'info.yml': 'label: My Test Submanifest',
                    '_canvas': {
                        'info.yml': 'label: My Test Subcanvas',
                        'page_1.jpg': new Buffer(require('./fixtures/cat-jpg')),
                        'thumb.png': new Buffer(require('./fixtures/cat-jpg'))
                    }
                }
            }
        },
        '/file-annotation-collection': {
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
                    'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
                },
                '_json': {
                    'file.json': 'json'
                },
                '_mp3': {
                    'file.mp3': new Buffer([8, 6, 7, 5, 3, 0, 9])
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
                    'file.png': new Buffer(require('./fixtures/cat-jpg'))
                }              
            },
            'erroneous-file': {
                '_files': {
                    'file.abc': 'abc'
                } 
            },
            'files-per-canvas': {
                '_files': {
                    'file.crt': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.drc': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.gltf': 'gltf',
                    'file.jpg': new Buffer(require('./fixtures/cat-jpg')),
                    'file.json': 'json',
                    'file.mp3': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.mp4': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.obj': 'obj',
                    'file.pdf': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                    'file.ply': 'ply',
                    'file.png': new Buffer(require('./fixtures/cat-jpg')),
                }        
            }
        },
        '/sort-canvases-manifest': {
            '_a-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_b-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_c-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_d-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_e-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_f-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_g-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_h-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_i-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_j-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_k-canvas': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        },
        '/sort-canvases-numeric-manifest': {
            '_page-1': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-2': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-3': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-4': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-5': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-6': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-7': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-8': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-9': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-10': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-11': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-12': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-13': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-14': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-15': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-16': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-17': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-18': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-19': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-20': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-21': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        },
        '/sort-files-numeric-manifest': {
            'page1.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page2.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page3.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page4.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page5.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page6.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page7.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page8.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page9.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page10.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page11.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page12.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page13.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page14.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page15.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page16.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page17.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page18.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page19.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page20.jpg': new Buffer(require('./fixtures/cat-jpg')),
            'page21.jpg': new Buffer(require('./fixtures/cat-jpg'))
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
                    'texture.png': new Buffer(require('./fixtures/cat-jpg'))
                },
                'painting-gltf.yml': require('./fixtures/painting-gltf')
            },
            '_painting-jpg': {
                'assets': { 
                    'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
                },
                'painting-jpg.yml': require('./fixtures/painting-jpg'),
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_painting-threejs-json-with-type': {
                'assets': { 
                    'file.json': 'json',
                    'texture.png': new Buffer(require('./fixtures/cat-jpg'))
                },
                'painting-threejs-json-with-type.yml': require('./fixtures/painting-threejs-json-with-type')
            }
        },
        '/generate-thumbs-manifest': {
            '_canvas-without-thumb': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        },
        '/canvas-with-dimensions-manifest': {
            '_canvas-with-dimensions': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg')),
                'painting-jpg-with-xywh.yml': require('./fixtures/painting-jpg-with-xywh'),
                'info.yml': require('./fixtures/dimensions-info')
            }
        },
        '/canvas-with-presentation-3-image-service-manifest': {
            '_canvas-with-presentation-3-image-service': {
                'presentation-3-image-service.yml': require('./fixtures/presentation-3-image-service')
            }
        },
        '/behavior-paged-manifest': {
            'info.yml': require('./fixtures/behavior-paged'),
            '_page-1': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-2': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        },
        '/multiple-behavior-manifest': {
            'info.yml': require('./fixtures/multiple-behavior'),
            '_page-1': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            },
            '_page-2': {
                'file.jpg': new Buffer(require('./fixtures/cat-jpg'))
            }
        }
    });
})

after(async () => {
    mock.restore();
});

importTest('utils', './tests/utils');
importTest('do-promises-work', './tests/do-promises-work');
importTest('thumbs-single-manifest', './tests/thumbs-single-manifest');
importTest('thumbs-single-manifest-dat', './tests/thumbs-single-manifest-dat');
importTest('files-only-manifest', './tests/files-only-manifest');
importTest('files-only-manifest-dat', './tests/files-only-manifest-dat');
importTest('files-only-collection', './tests/files-only-collection');
importTest('gh-pages', './tests/gh-pages');
importTest('collection-no-manifests', './tests/collection-no-manifests');
importTest('collection', './tests/collection');
importTest('file-annotation-collection', './tests/file-annotation-collection');
importTest('sort-canvases-manifest', './tests/sort-canvases-manifest');
importTest('sort-canvases-numeric-manifest', './tests/sort-canvases-numeric-manifest');
importTest('sort-files-numeric-manifest', './tests/sort-files-numeric-manifest');
importTest('custom-annotations-manifest', './tests/custom-annotations-manifest');
importTest('generate-thumbs-manifest', './tests/generate-thumbs-manifest');
importTest('dat-gateway', './tests/dat-gateway');
importTest('canvas-with-dimensions-manifest', './tests/canvas-with-dimensions-manifest');
importTest('canvas-with-presentation-3-image-service-manifest', './tests/canvas-with-presentation-3-image-service-manifest');
importTest('behavior-paged-manifest', './tests/behavior-paged-manifest');
importTest('multiple-behavior-manifest', './tests/multiple-behavior-manifest');