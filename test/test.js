const assert = require('assert');
const biiif = require('../index');
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
                    'thumb.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                }
            }
        }
    });
})

after(async () => {
    mock.restore();
})

describe('biiif', async () => {

    let collectionJson;
    let manifestJson;
    let canvasJson;
    let thumbnailJson;

    it('can find collection', async () => {
        assert(fs.existsSync('/collection'));
        biiif('/collection', 'http://test.com/collection');
    });

    it('can find collection index.json', async () => {
        const file = '/collection/index.json';
        assert(fs.existsSync(file));
        collectionJson = jsonfile.readFileSync(file);
        assert(collectionJson.label === 'My Test Collection');
    });

    it('can find manifest index.json', async () => {
        const file = '/collection/manifest/index.json';
        assert(fs.existsSync(file));
        manifestJson = jsonfile.readFileSync(file);
        assert(manifestJson.label === 'My Test Manifest');
    });

    it('has correct collection id', async () => {
        assert(collectionJson.id === 'http://test.com/collection/index.json');
    });

    it('can read collection label', async () => {
        assert(collectionJson.label === 'My Test Collection');
    });

    it('has correct manifest id', async () => {
        assert(manifestJson.id === 'http://test.com/collection/manifest/index.json');
    });

    it('can read manifest label', async () => {
        assert(manifestJson.label === 'My Test Manifest');
    });

    it('can find canvas', async () => {
        canvasJson = manifestJson.sequences[0].canvases[0];
        assert(canvasJson);
    });

    it('has correct canvas id', async () => {
        assert(canvasJson.id === 'http://test.com/collection/manifest/index.json/canvas/0');
    });

    it('can read canvas label', async () => {
        assert(canvasJson.label === 'My Test Canvas');
    });

    it('has a thumbnail', async () => {
        thumbnailJson = canvasJson.thumbnail[0];
        assert(thumbnailJson);
    });

    it('has the correct thumbnail id', async () => {
        assert(thumbnailJson.id === 'http://test.com/collection/manifest/_canvas/thumb.png');
    });

});