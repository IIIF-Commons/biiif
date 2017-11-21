# biiif (build iiif)

```
npm i biiif -save
```

```
const biiif = require('biiif');
biiif('myfolder', 'http://example.com/myfolder');
```

BIIIF uses your file system to generate static IIIF collections and manifests.

Use [biiif-cli](https://github.com/edsilv/biiif-cli) to run from a terminal.

Note: This uses the [IIIF Presentation API v3](http://prezi3.iiif.io/api/presentation/3.0/) (currently in alpha), but is compatible with the [Universal Viewer](http://universalviewer.io) v3 (in development).

## Conventions

A collection is a folder with sub-folders whose names _do not_ start with an underscore.

A manifest is a folder with sub-folders whose names _do_ start with an underscore.

A collection's sub-folders (no underscore) are treated as further nested collections.

A manifest's sub-folders (with underscore) are treated as canvases to add to the manifest.

Files within 'canvas folders' (.jpg, .pdf, .mp4, .obj) are annotated onto the canvas.

You must pass a `-u` parameter to specify the base URL used to generate all of the `id` IRIs.

## Metadata

To add metadata to your collections/manifests/canvases, include an `info.yml` file in the folder e.g.

```
label: The Lord of the Rings
description: The Lord of the Rings Trilogy
attribution: J. R. R. Tolkien
metadata:
    license: Copyright Tolkien Estate
    Author: J. R. R. Tolkien
```

## Thumbnails

To add a thumbnail to your collection, manifest, or canvas simply include a file named `thumb.jpg` (any image extension will work) in the directory.

## Examples

Here is an example of how to organise your files/folders for BIIIF.

This example only has a single root collection, but BIIIF will happily build collections to any nested depth. 

BIIIF will accept a manifest folder too, generating a single manifest `index.json`.

```
lord-of-the-rings                  // collection
├── info.yml                       // collection metadata
├── the-fellowship-of-the-ring     // manifest
|   ├── _page-1                    // canvas
|   |   ├── page-1.jpg             // content annotation
|   |   ├── thumb.jpg              // thumbnail
|   |   └── info.yml               // canvas metadata
|   ├── _page-2                    // canvas
|   |   ├── page-2.jpg             // content annotation
|   |   ├── thumb.jpg              // thumbnail
|   |   └── info.yml               // canvas metadata
|   ├── _page-n                    // canvas
|   |   ├── page-n.jpg             // content annotation
|   |   ├── thumb.jpg              // thumbnail
|   |   └── info.yml               // canvas metadata
|   └── info.yml                   // manifest metadata
├── the-two-towers                 // manifest
|   ├── _page-1                    // canvas
|   ├── _page-2                    // canvas
|   ├── _page-n                    // canvas
|   └── info.yml                   // manifest metadata
└── the-return-of-the-king         // manifest
    ├── _page-1                    // canvas
    ├── _page-2                    // canvas
    ├── _page-n                    // canvas
    └── info.yml                   // manifest metadata
```






