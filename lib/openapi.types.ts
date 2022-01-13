import { OpenAPIV3 } from "openapi-types";


export type PathObjectFactory = (document: OpenAPIV3Doc) => OpenAPIV3.PathItemObject;

export interface PathsObjectFactoryMap {
    [path: string]: (document: OpenAPIV3Doc) => OpenAPIV3.PathItemObject
}

export interface OpenAPIV3Doc<T extends {} = {}> extends Omit<OpenAPIV3.Document, 'paths'> {
    paths: OpenAPIV3.PathsObject<T> | PathsObjectFactoryMap
}