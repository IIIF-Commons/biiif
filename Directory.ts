import { Canvas } from "./Canvas";
import { join, basename } from "path";
import { promise as glob } from "glob-promise";
import { URL } from "url";
import {
  cloneJson,
  compare,
  fileExists,
  formatMetadata,
  getLabel,
  getThumbnail,
  hasManifestsYml,
  log,
  readYml,
  warn,
  writeJson,
} from "./Utils";
// import urljoin from "url-join";
const urljoin = require("url-join");
// boilerplate json
import canvasBoilerplate from "./boilerplate/canvas.json";
import collectionBoilerplate from "./boilerplate/collection.json";
import collectionItemBoilerplate from "./boilerplate/collectionitem.json";
import manifestBoilerplate from "./boilerplate/manifest.json";
import manifestItemBoilerplate from "./boilerplate/manifestitem.json";
import thumbnailBoilerplate from "./boilerplate/thumbnail.json";

export class Directory {
  public directories: Directory[] = [];
  public directoryPath: string;
  public generateThumbs: boolean;
  public indexJson: any;
  public infoYml: any;
  public isCollection: boolean;
  public items: Canvas[] = [];
  public parentDirectory: Directory | undefined;
  public url: URL;
  public virtualName: string | undefined; // used when root directories are dat/ipfs keys

  constructor(
    directoryPath: string,
    url: string,
    virtualName?: string,
    parentDirectory?: Directory
  ) {
    this.directoryPath = directoryPath;
    this.url = new URL(url);
    this.parentDirectory = parentDirectory;
    this.virtualName = virtualName;
  }

  public async read(): Promise<void> {
    // canvases are directories starting with an underscore
    const canvasesPattern: string = this.directoryPath + "/_*";

    const canvases: string[] = await glob(canvasesPattern, {
      ignore: ["**/*.yml", "**/thumb.*", "**/!*"],
    });

    // sort canvases
    canvases.sort((a, b) => {
      return compare(a, b);
    });

    await Promise.all(
      canvases.map(async (canvas: string) => {
        log(`creating canvas for: ${canvas}`);
        this.items.push(new Canvas(canvas, this));
      })
    );

    // directories not starting with an underscore
    // these can be child manifests or child collections
    const directoriesPattern: string = this.directoryPath + "/*";

    const directories: string[] = await glob(directoriesPattern, {
      ignore: [
        "**/*.{crt,drc,epub,glb,gltf,gz,stl,jpg,jpeg,json,md,mp3,mp4,nii,obj,opf,pdf,ply,png,toml,usdz,vtt,yml}", // ignore files (must include file extensions explicitly, otherwise directories with a . are matched)
        "**/_*", // ignore canvas folders
        "**/+*", // ignore generated folders
        "**/!*", // ignore folders starting with a !
      ],
    });

    // sort canvases
    directories.sort((a, b) => {
      return compare(a, b);
    });

    await Promise.all(
      directories.map(async (directory: string) => {
        log(`creating directory for: ${directory}`);
        const name: string = basename(directory);
        const url: string = urljoin(this.url.href, name);
        const newDirectory: Directory = new Directory(
          directory,
          url,
          undefined,
          this
        );
        await newDirectory.read();
        this.directories.push(newDirectory);
      })
    );

    // if there are no canvas, manifest, or collection directories to read,
    // but there are paintable files in the current directory,
    // create a canvas for each.
    if (!this.directories.length && !canvases.length) {
      const paintableFiles: string[] = await glob(this.directoryPath + "/*.*", {
        ignore: ["**/*.yml", "**/thumb.*", "**/index.json"],
      });

      // sort files
      paintableFiles.sort((a, b) => {
        return compare(a, b);
      });

      paintableFiles.forEach((file: string) => {
        log(`creating canvas for: ${file}`);
        this.items.push(new Canvas(file, this));
      });
    }

    this.isCollection =
      this.directories.length > 0 ||
      (await hasManifestsYml(this.directoryPath));

    await this._getInfo();
    await this._createIndexJson();

    if (this.isCollection) {
      log(`created collection: ${this.directoryPath}`);
      // if there are canvases, warn that they are being ignored
      if (this.items.length) {
        warn(
          `${this.items.length} unused canvas directories (starting with an underscore) found in the ${this.directoryPath} collection. Remove directories not starting with an underscore to convert into a manifest.`
        );
      }
    } else {
      log(`created manifest: ${this.directoryPath}`);
      // if there aren't any canvases, warn that there should be
      if (!this.items.length) {
        warn(
          `${this.directoryPath} is a manifest, but no canvases (directories starting with an underscore) were found. Therefore it will not have any content.`
        );
      }
    }
  }

  private async _getInfo(): Promise<void> {
    this.infoYml = {};

    // if there's an info.yml
    const ymlPath: string = join(this.directoryPath, "info.yml");

    const exists: boolean = await fileExists(ymlPath);

    if (exists) {
      this.infoYml = await readYml(ymlPath);
      log(`got metadata for: ${this.directoryPath}`);
    } else {
      log(`no metadata found for: ${this.directoryPath}`);
    }

    if (!this.infoYml.label) {
      // default to the directory name
      this.infoYml.label = basename(this.directoryPath);
    }
  }

  private async _createIndexJson(): Promise<void> {
    if (this.isCollection) {
      this.indexJson = cloneJson(collectionBoilerplate);

      // for each child directory, add a collectionitem or manifestitem json boilerplate to items.

      await Promise.all(
        this.directories.map(async (directory: Directory) => {
          let itemJson: any;

          if (directory.isCollection) {
            itemJson = cloneJson(collectionItemBoilerplate);
          } else {
            itemJson = cloneJson(manifestItemBoilerplate);
          }

          itemJson.id = urljoin(directory.url.href, "index.json");
          itemJson.label = getLabel(directory.infoYml.label);

          await getThumbnail(itemJson, directory);

          this.indexJson.items.push(itemJson);
        })
      );

      // check for manifests.yml. if it exists, parse and add to items
      const hasYml: boolean = await hasManifestsYml(this.directoryPath);

      if (hasYml) {
        const manifestsPath: string = join(this.directoryPath, "manifests.yml");
        const manifestsYml: any = await readYml(manifestsPath);

        manifestsYml.manifests.forEach((manifest: any) => {
          const itemJson: any = cloneJson(collectionItemBoilerplate);
          itemJson.id = manifest.id;

          if (manifest.label) {
            itemJson.label = getLabel(manifest.label);
          } else {
            // no label supplied, use the last fragment of the url
            const url: URL = new URL(itemJson.id);
            const pathname: string[] = url.pathname.split("/");

            if (pathname.length > 1) {
              itemJson.label = getLabel(pathname[pathname.length - 2]);
            }
          }

          if (manifest.thumbnail) {
            if (typeof manifest.thumbnail === "string") {
              const thumbnail: any[] = cloneJson(thumbnailBoilerplate);
              thumbnail[0].id = manifest.thumbnail;
              itemJson.thumbnail = thumbnail;
            } else {
              itemJson.thumbnail = manifest.thumbnail;
            }
          }

          this.indexJson.items.push(itemJson);
        });

        log(`parsed manifests.yml for ${this.directoryPath}`);
      } else {
        log(`no manifests.yml found for: ${this.directoryPath}`);
      }

      // sort items
      this.indexJson.items.sort((a, b) => {
        return compare(
          a.label["@none"][0].toLowerCase(),
          b.label["@none"][0].toLowerCase()
        );
      });
    } else {
      this.indexJson = cloneJson(manifestBoilerplate);

      // for each canvas, add canvas json

      let index: number = 0;

      for (const canvas of this.items) {
        const canvasJson: any = cloneJson(canvasBoilerplate);
        canvasJson.id = urljoin(this.url.href, "index.json/canvas", index);
        canvasJson.items[0].id = urljoin(
          this.url.href,
          "index.json/canvas",
          index,
          "annotationpage/0"
        );

        await canvas.read(canvasJson);

        // add canvas to items
        this.indexJson.items.push(canvasJson);

        index++;
      }

      this.indexJson.items.sort((a, b) => {
        return compare(a.id, b.id);
      });
    }

    this.indexJson.id = urljoin(this.url.href, "index.json");

    this._applyInfo();

    await getThumbnail(this.indexJson, this);

    // write index.json
    const path: string = join(this.directoryPath, "index.json");
    const json: string = JSON.stringify(this.indexJson, null, "  ");

    log(`creating index.json for: ${this.directoryPath}`);

    await writeJson(path, json);
  }

  private _applyInfo(): void {
    this.indexJson.label = getLabel(this.infoYml.label); // defaults to directory name

    if (this.infoYml.metadata) {
      this.indexJson.metadata = formatMetadata(this.infoYml.metadata);
    }

    // add manifest-specific properties
    if (!this.isCollection) {
      if (this.infoYml.attribution) {
        this.indexJson.attribution = this.infoYml.attribution;
      }

      if (this.infoYml.description) {
        this.indexJson.description = this.infoYml.description;
      }

      if (this.infoYml.behavior) {
        this.indexJson.behavior = [];

        if (Array.isArray(this.infoYml.behavior)) {
          this.infoYml.behavior.forEach((behavior) => {
            this.indexJson.behavior.push(behavior);
          });
        } else {
          this.indexJson.behavior.push(this.infoYml.behavior);
        }
      }
    }
  }
}
