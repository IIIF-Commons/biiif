# biiif (build iiif) 👷✨📃

[![Build Status](https://travis-ci.org/edsilv/biiif.png?branch=master)](https://travis-ci.org/edsilv/biiif)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fedsilv%2Fbiiif.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fedsilv%2Fbiiif?ref=badge_shield)
[![Node version](https://img.shields.io/node/v/biiif.svg?style=flat)](http://nodejs.org/download/)
<!-- ![IIIF Presentation API 3 compliant](https://img.shields.io/badge/iiif--presentation--api-%3E=3-blue.png) -->

```
npm i biiif --save
```

```
const { build } = require('biiif');
build('myfolder', 'http://example.com/myfolder');
```



Organise your files according to a simple [naming convention](https://github.com/edsilv/biiif#examples) to generate [IIIF](http://iiif.io) json.

Use [biiif-cli](https://github.com/edsilv/biiif-cli) to run from a terminal.

Note: This uses the [IIIF Presentation API v3](http://prezi3.iiif.io/api/presentation/3.0/) (currently in alpha), but is compatible with the [Universal Viewer](http://universalviewer.io) v3 (in beta).

If you want to build a website with biiif, try [uv-app-starter](https://github.com/UniversalViewer/uv-app-starter) which comes with the [Universal Viewer](http://universalviewer.io) and biiif already set up.

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

## Linked Manifests

Sometimes you may need to include IIIF manifests in your collection from elsewhere. To do this, include a `manifests.yml` file in your collection folder e.g.

```
manifests:
- id: http://test.com/collection/linkedmanifest1/index.json
  label: Linked Manifest 1
  thumbnail: http://test.com/collection/linkedmanifest1/thumb.jpg
- id: http://test.com/collection/linkedmanifest2/index.json
  label: Linked Manifest 2
- id: http://test.com/collection/linkedmanifest3/index.json
```

If you leave the `label` property blank, it will default to the name of the last folder in the `id` URL.

Including a `manifests.yml` file in a folder without any sub-folders forces it to behave like a collection.

## Examples

Here is an example of how to organise your files/folders for biiif.

This example only has a single root collection, but biiif will happily build collections to any nested depth. 

biiif will accept a manifest folder too, generating a single manifest `index.json`.

```
lord-of-the-rings                  // collection
├── info.yml                       // collection metadata
├── thumb.jpg                      // collection thumbnail
├── the-fellowship-of-the-ring     // manifest
|   ├── _page-1                    // canvas
|   |   ├── page-1.jpg             // content annotation
|   |   ├── thumb.jpg              // canvas thumbnail
|   |   └── info.yml               // canvas metadata
|   ├── _page-2                    // canvas
|   |   ├── page-2.jpg             // content annotation
|   |   ├── thumb.jpg              // canvas thumbnail
|   |   └── info.yml               // canvas metadata
|   ├── _page-n                    // canvas
|   |   ├── page-n.jpg             // content annotation
|   |   ├── thumb.jpg              // canvas thumbnail
|   |   └── info.yml               // canvas metadata
|   ├── info.yml                   // manifest metadata
|   └── thumb.jpg                  // manifest thumbnail
├── the-two-towers                 // manifest
|   ├── _page-1                    // canvas
|   ├── _page-2                    // canvas
|   ├── _page-n                    // canvas
|   ├── info.yml                   // manifest metadata
|   └── thumb.jpg                  // manifest thumbnail
└── the-return-of-the-king         // manifest
    ├── _page-1                    // canvas
    ├── _page-2                    // canvas
    ├── _page-n                    // canvas
    ├── info.yml                   // manifest metadata
    └── thumb.jpg                  // manifest thumbnail
```





