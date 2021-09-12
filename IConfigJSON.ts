import { TypeFormat } from "./TypeFormat";

export interface IConfigJSON {
  thumbnails: thumbnails;
  annotation: annotation;
}

export interface settings {}

export interface thumbnails {
  width: number;
  height: number;
}

export interface painting {
  [key: string]: TypeFormat[];
}

export interface commenting {
  [key: string]: TypeFormat[];
}

export interface motivations {
  painting: painting;
  commenting: commenting;
}

export interface annotation {
  motivations: motivations;
}

export interface RootObject {
  settings: settings;
  thumbnails: thumbnails;
  annotation: annotation;
}
