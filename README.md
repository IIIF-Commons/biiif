# biiif (build iiif) 👷✨📃

[![Build Status](https://travis-ci.org/edsilv/biiif.png?branch=master)](https://travis-ci.org/edsilv/biiif)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fedsilv%2Fbiiif.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fedsilv%2Fbiiif?ref=badge_shield)
[![Node version](https://img.shields.io/node/v/biiif.svg?style=flat)](http://nodejs.org/download/)
![IIIF Presentation API 3 compliant](https://img.shields.io/badge/iiif--presentation--api-%3E=3-blue.png)

```
npm i biiif --save
```

```
const { build } = require('biiif');
build('myfolder', 'http://example.com/myfolder');
```



biiif uses your file system to generate static [IIIF](http://iiif.io) collections and manifests.

Use [biiif-cli](https://github.com/edsilv/biiif-cli) to run from a terminal.

Note: This uses the [IIIF Presentation API v3](http://prezi3.iiif.io/api/presentation/3.0/) (currently in alpha), but is compatible with the [Universal Viewer](http://universalviewer.io) v3 (in development).

To get started quickly, try [uv-app-starter](https://github.com/UniversalViewer/uv-app-starter) which comes with biiif included!

## Conventions

A collection is a folder with sub-folders whose names _do not_ start with an underscore.

A manifest is a folder with sub-folders whose names _do_ start with an underscore.

A collection's sub-folders (no underscore) are treated as further nested collections.

A manifest's sub-folders (with underscore) are treated as canvases to add to the manifest.

Files within 'canvas folders' (.jpg, .pdf, .mp4, .obj) are annotated onto the canvas.

## Metadata

To add metadata to your collections/manifests/canvases, include an `info.yml` file in the folder e.g.

```
label: The Lord of the Rings
description: The Lord of the Rings Trilogy
attribution: J. R. R. Tolkien
metadata:
    License: Copyright Tolkien Estate
    Author: J. R. R. Tolkien
    Published Date: 29 July 1954
```

## Thumbnails

To add a thumbnail to your collection, manifest, or canvas simply include a file named `thumb.jpg` (any image file extension will work) in the directory.

## Examples

Here is an example of how to organise your files/folders for biiif.

This example only has a single root collection, but biiif will happily build collections to any nested depth. 

biiif will accept a manifest folder too, generating a single manifest `index.json`.

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





