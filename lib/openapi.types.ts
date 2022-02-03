import { OpenAPIV3 } from "openapi-types";


export type PathObjectFactory = (document: OpenAPIV3Doc) => OpenAPIV3.PathItemObject;

export interface CustomOperationObject {
    requestBody?: (document: OpenAPIV3Doc) => OpenAPIV3.RequestBodyObject,
    responses: CustomResponsesObject
}

export interface CustomResponsesObject {
    [code: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject | ((document: OpenAPIV3Doc) => OpenAPIV3.ResponseObject); 
}

export type CustomPathItemObject = {
    [method in OpenAPIV3.HttpMethods]?: CustomOperationObject
};
export interface CustomPathsObject {
    [path: string]: CustomPathItemObject
}

export interface OpenAPIV3Doc<T extends {} = {}> extends Omit<OpenAPIV3.Document, 'paths'> {
    paths: OpenAPIV3.PathsObject<T> | CustomPathsObject
}