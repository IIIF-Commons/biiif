# BIIIF (Build IIIF)

    npm i biiif -g

BIIIF is a CLI that uses your file system to generate IIIF collections and manifests.

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




