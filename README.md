# Biiif: Building IIIF Content with Ease! 👷✨📃

Biiif is a tool that simplifies the process of creating [IIIF (International Image Interoperability Framework)](http://iiif.io)  content using Node.js. IIIF is a standard for sharing and presenting digital images and metadata, often used in cultural heritage and digital library projects. With biiif, if you organize your files following a specific convention and then build, it will generate IIIF content using 100% Node.js. [IPFS](https://github.com/ipfs) compatible.

## Build Instructions 
[![Node version](https://img.shields.io/node/v/biiif.svg?style=flat)](http://nodejs.org/download/)

<!-- ![IIIF Presentation API 3 compliant](https://img.shields.io/badge/iiif--presentation--api-%3E=3-blue.png) -->

```bash
npm i biiif --save
```

```bash
const { build } = require('biiif');
build('myfolder', 'http://example.com/myfolder');
```
[Parameters Documentation](https://github.com/IIIF-Commons/biiif/blob/master/README.md#parameters)

Use [biiif-cli](https://github.com/edsilv/biiif-cli) to run from a terminal.

_Note: This uses the [IIIF Presentation API v3](http://prezi3.iiif.io/api/presentation/3.0/), and is compatible with the [Universal Viewer](http://universalviewer.io) v3._

Github template repo for hosting IIIF on Netlify and Vercel: https://github.com/iiif-commons/biiif-template


## Feature Set 

| Feature               | Description                                                                                                                                      | Documentation Link                                                                                   |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Generate IIIF Manifests | Create IIIF manifests to describe digital objects, collections, and their relationships. Use in IIIF-compatible viewers and applications.       | [Documentation](https://github.com/edsilv/biiif-test-manifests)                                        |
| Custom Annotations     | Customize annotations for digital objects, including painting, commenting, or other use cases. Files within manifest folders are annotated onto the canvas with a `painting` motivation by default. You can create custom annotations in YAML files if needed.                                                | [Documentation](https://github.com/IIIF-Commons/biiif#annotations)                                  |
| Image Tile Services    | Automatically generate IIIF image tiles for images, optimizing their delivery and presentation in IIIF viewers. biiif will automatically generate IIIF image tiles for images and place them in a `+tiles` directory.                                | [Documentation](https://github.com/IIIF-Commons/biiif#image-tile-services)                           |
| Metadata               | Include metadata for digital objects, offering descriptive information. Enhance accessibility and discoverability. You can add metadata as an `info.yml` file within a collection, manifest, or canvas folder. This includes labels, descriptions, attributions, and custom key-value metadata.                             | [Documentation](https://github.com/IIIF-Commons/biiif#metadata)                                      |
| Thumbnails             | Add thumbnails to collections, manifests, or canvases. Simplify user navigation by including a `thumb.jpg` file. To add a thumbnail, include a file named `thumb.jpg` in the directory. If no thumbnail is found in a canvas directory, biiif generates one from an annotated image.                             | [Documentation](https://github.com/IIIF-Commons/biiif#thumbnails)                                    |
| Linked Manifests       | Include external IIIF manifests in your collection using a `manifests.yml` file. You can include external IIIF manifests in your collection using a `manifests.yml` file.                                                                | [Documentation](https://github.com/IIIF-Commons/biiif#linked-manifests)     


## How your folder should look before building with biiif

Let's start with an example
    
    my-collection/:                  # Root collection folder containing collection-level metadata and a thumbnail
      ├── info.yml:                  # Collection metadata (Optional)
      ├── thumb.jpg:                 # Collection thumbnail (Optional)
      ├── my-manifest-1/:            # First manifest representing a distinct digital object (image, audio, video)
      │   ├── _canvas-1/:            # First canvas within the first manifest
      │   ├── _canvas-2/:            # Second canvas within the first manifest
      │   ├── info.yml:              # Metadata for the first manifest (Optional)
      │   └── thumb.jpg:             # Thumbnail for the first manifest (Optional)
      ├── my-manifest-2/:            # Second manifest representing another distinct digital object (image, audio, video)
      │   ├── _canvas-1/:            # First canvas within the second manifest
      │   ├── info.yml:              # Metadata for the second manifest (Optional)
      │   └── thumb.jpg:             # Thumbnail for the second manifest (Optional)

1. **Collection vs. Manifest:**
   - A **collection** is represented by a folder (e.g., `my-collection/`) that contains sub-folders.
   - A **manifest** is also represented by a folder (e.g., `my-manifest-1/`, `my-manifest-2/`) but has sub-folders whose names start with an underscore (e.g., `_canvas-1/`, `_canvas-2/`).

2. **Nested Collections:**
   - Inside a **collection** folder (e.g., `my-collection/`), sub-folders with names that do not start with an underscore (e.g., `my-manifest-1/`, `my-manifest-2/`) represent further nested collections. These nested collections can be used to organize your content hierarchically.

3. **Canvases in Manifests:**
   - Inside a **manifest** folder (e.g., `my-manifest-1/`, `my-manifest-2/`), sub-folders with names that start with an underscore (e.g., `_canvas-1/`, `_canvas-2/`) are treated as canvases to add to the manifest. Each canvas typically represents a page or view of the content.

4. **Annotating Files on Canvases:**
   - Files within the "canvas folders" (e.g., `_canvas-1/`, `_canvas-2/`) are typically image files (e.g., `image.jpg`, `image.png`, etc.) or other content files (e.g., `.pdf`, `.mp4`, `.obj`). These files are automatically annotated onto the canvas with a **painting motivation**. This means that they are considered part of the canvas content.

5. **Single Root Collection:**
   - In the provided example, there is a single root collection named `my-collection/`. This is the top-level collection that contains nested manifests and collections.

6. **Nested Depth:**

      - In the example, we have a single root collection named `my-collection/`. Inside this root collection, we have three manifests (`my-manifest-1/`, `my-manifest-2/`, `my-manifest-3/`), each containing canvases. However, you can continue nesting collections and manifests to any depth you need. For instance, if you wanted to create a more complex hierarchy, you could do something like this:

        ```yml
        my-collection/                      // Root collection folder
        ├── info.yml                        // Collection metadata
        ├── thumb.jpg                       // Collection thumbnail
        ├── my-nested-collection/            // Nested collection
        |   ├── info.yml                    // Metadata for the nested collection
        |   ├── my-manifest-3/              // Third manifest within the nested collection
        |   |   ├── _canvas-1/              // First canvas within the third manifest
        |   |   ├── _canvas-2/              // Second canvas within the third manifest
        |   |   ├── info.yml                // Metadata for the third manifest
        |   |   └── thumb.jpg               // Thumbnail for the third manifest
        |   └── my-nested-collection-2/     // Further nested collection within the nested collection
        |       ├── info.yml                // Metadata for the further nested collection
        |       ├── my-manifest-4/          // Fourth manifest within the further nested collection
        |       |   ├── _canvas-1/          // First canvas within the fourth manifest
        |       |   ├── _canvas-2/          // Second canvas within the fourth manifest
        |       |   ├── info.yml            // Metadata for the fourth manifest
        |       |   └── thumb.jpg           // Thumbnail for the fourth manifest
        |       └── ...                     // More nested collections and manifests if needed
        └── ...
        ```

7. **Manifest Folder for Biiif:**
    - With **biiif**, you can organize your content into a manifest folder, and **biiif** will generate a single **manifest index.json** for that folder.

      Here's an example:
      Let's say you have a manifest folder named `my-manifest-folder/`, and it contains the following structure:

        ```plaintext
        my-manifest-folder/
        ├── _canvas-1/
        │   ├── image.jpg
        │   └── info.yml
        ├── _canvas-2/
        │   ├── image.jpg
        │   └── info.yml
        ├── info.yml
        └── thumb.jpg
        ```

    - Normally, you would expect **biiif** to generate individual manifests for each canvas within this folder. However, if you want to treat this entire folder as a single manifest, you can do so. **biiif** will recognize this folder as a manifest and generate a single **manifest index.json** that encompasses all the canvases within it. So, the result will be a **manifest index.json** that represents the entire `my-manifest-folder/` as a single manifest, making it easier to manage and present your content.

8. **Exclude a Folder**

    - If you need to include a folder in your project but don't want biiif to treat it as a manifest, add a `!` to the start of its name, e.g. 



# Documentation

## Parameters

| Parameter     | Type   | Description                                                                                                                                     |
| :------------ | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `folder`      | string | The source folder of your IIIF collection/manifest on disk                                                                                      |
| `url`         | string | The Url to use as the root for all generated manifest, asset identifiers                                                                        |
| `virtualName` | string | Overrides the source folder name when generating identifiers e.g. a dat archive id you need to appear in Urls instead of the source folder name |


## Annotations

IIIF Presentation 3.0 incorporates the use of the [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/) for annotating canvases. By default, when using biiif, any files found in a canvas directory (excluding `info.yml` and `thumb.jpg`) are automatically annotated onto the canvas with a default motivation of `painting`. This default behavior simplifies the generation of basic manifests. However, there are situations where you may want to customize annotations, such as adding text annotations with a `commenting` motivation or managing files like obj or gltf with associated image textures. Custom annotations allow you to achieve this flexibility.

To create custom annotations, simply create a file with a `.yml` extension in the canvas directory and define the desired annotation properties within that file. Below are examples illustrating how to create custom annotations.

### Text Annotation Example (`my-comment.yml`):

```yml
motivation: commenting
value: This is my comment on the image
```

In this example, we've excluded the `type` (assumed to be `TextualBody`) and `format` (assumed to be `text/plain`). By specifying the `motivation` as `commenting`, you can annotate text onto the canvas with this specific motivation.

### 3D Object (gltf) Example (`my-3d-object.yml`):

```yml
value: assets/myobject.gltf
```

For 3D objects like gltf files, you can create a custom annotation file like this. In this case, we've excluded the `motivation` (assumed to be `painting`), `type` (assumed to be `Model`), and `format` (assumed to be `model/gltf+json`). You only need to include the `value` property pointing to the location of the gltf file itself, which should typically be placed in an `assets` folder within the canvas directory. Importantly, associated image textures residing in the `assets` folder won't be annotated unless you specifically request them to be.

biiif is aware that certain file types like gltf typically have specific properties, so it can make assumptions to simplify the annotation process.


## Image Tile Services

biiif automatically creates IIIF image tiles and places them in a `+tiles` directory, along with an accompanying `info.json` file. The `+` prefix signifies that biiif ignores these directories when generating manifests. The image service is included in the annotations for each image in your IIIF manifest.

## Metadata

Metadata is not required but can be added as an `info.yml` file within a collection, manifest, or canvas folder. Here's an example of how to structure an `info.yml` file:

```yml
label: The Lord of the Rings
description: The Lord of the Rings Trilogy
attribution: J. R. R. Tolkien
metadata:
  License: Copyright Tolkien Estate
  Author: J. R. R. Tolkien
  Published Date: 29 July 1954
```

In this example, we have a `label`, `description`, and `attribution` at the top-level. For IIIF Presentation 3 (beta), `description` is now called `summary`, and `attribution` is called `requiredStatement`, but the older terms still work in IIIF viewers.

You can also include a `metadata` section with custom key-value pairs to add additional information specific to your content. There is no strict specification for this section, allowing flexibility in what you include. 

For better organization, you can add an `info.yml` to each subfolder if you have multiple canvases in a manifest, each containing image-specific metadata. This makes your GitHub documentation more coherent and user-friendly.

## Thumbnails

To add a thumbnail to your collection, manifest, or canvas simply include a file named `thumb.jpg` (any image file extension will work) in the directory.

If no thumb image is found in a canvas directory, biiif checks to see if an image is being annotated onto the canvas with a painting motivation. If so, a thumb is generated (100 x 100px) from that.

## Linked Manifests

Often it's necessary to include IIIF manifests in your collection from elsewhere. To do this, include a `manifests.yml` file in your collection folder e.g.

```yml
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

<!--MozFest zine workshop published on glitch: https://glitch.com/~edsilv-mozfest-zine-->

A repo of test manifests: https://github.com/edsilv/biiif-test-manifests

Collection for the [Nomad Project](https://nomad-project.co.uk): https://github.com/nomadproject/objects

IIIF 3D manifests: https://github.com/edsilv/iiif-3d-manifests

