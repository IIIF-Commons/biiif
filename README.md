# BIIIF (Build IIIF)

    npm i biiif -g

BIIIF is a CLI that uses your file system to generate static IIIF collections and manifests.

Note: This uses the [IIIF Presentation API v3](http://prezi3.iiif.io/api/presentation/3.0/) (currently in alpha), but is compatible with the [Universal Viewer](http://universalviewer.io) v3 (in development).

Example:

    biiif myfolder -u http://example.com

A collection is a folder with sub-folders whose names _do not_ start with an underscore.

A manifest is a folder with sub-folders whose names _do_ start with an underscore.

A collection's sub-folders (no underscore) are treated as further nested collections.

A manifest's sub-folders (with underscore) are treated as canvases to add to the manifest.

Files within 'canvas folders' (.jpg, .pdf, .mp4, .obj) are annotated onto the canvas.

You must pass a `-u` parameter to specify the base URL used to generate all of the `id` IRIs.

## Metadata

To add metadata to your collections/manifests, include an `info.yml` file in the folder e.g.

```
label: The Lord of the Rings
description: The Lord of the Rings Trilogy
attribution: J. R. R. Tolkien 
```

You can also add metadata to your canvases by including an `info.yml` in the canvas folder, e.g.

```
label: Illustration of Gollum
```

**Coming soon**

Support for a `metadata` field for collections, manifests, and canvases.

```
metadata:
    license: CC-BY-NC
    conditionsOfUse: ...

```

## Examples

Here is an example of how to organise your files/folders for BIIIF.

This example only has a single root collection, but BIIIF will happily build collections to any nested depth. 

BIIIF will accept a manifest folder too, generating a single manifest `index.json`.

```
lord-of-the-rings                   // collection
├── info.yml                        // collection metadata
├── the-fellowship-of-the-ring      // manifest
|    ├── _page-1                    // canvas
|    |   ├── page-1.jpg             // content annotation
|    |   └── info.yml               // canvas metadata
|    ├── _page-2                    // canvas
|    |   ├── page-2.jpg             // content annotation
|    |   └── info.yml               // canvas metadata
|    ├── _page-n                    // canvas
|    |   ├── page-n.jpg             // content annotation
|    |   └── info.yml               // canvas metadata
|    └── info.yml                   // manifest metadata
├── the-two-towers                  // manifest
|    ├── _page-1                    // canvas
|    ├── _page-2                    // canvas
|    ├── _page-n                    // canvas
|    └── info.yml                   // manifest metadata
└── the-return-of-the-king          // manifest
     ├── _page-1                    // canvas
     ├── _page-2                    // canvas
     ├── _page-n                    // canvas
     └── info.yml                   // manifest metadata
```






