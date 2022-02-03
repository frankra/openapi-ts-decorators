import { OpenAPIV3 } from "openapi-types";
import { maybeAddObjectToSchema } from "./jsonschema.generator";
import { getObjectByClass, MetadataObject, MetadataObjectProperty } from "./metadata";
import { OpenAPIV3Doc } from "./openapi.types";

export function generateOpenAPISpec(apiDocJson: OpenAPIV3Doc): OpenAPIV3.Document {
    apiDocJson = bootstrap(apiDocJson);
    return evalProperties(apiDocJson, apiDocJson);
}

function evalProperties(document: OpenAPIV3Doc, node: any): any {
    if (typeof node === 'object') {
        return <OpenAPIV3.Document>Object
            .keys(node).reduce((obj, key) => {
                const propertyValue = obj[key];
                switch (typeof propertyValue) {
                    case 'function':
                        obj[key] = propertyValue(document);
                        return obj;
                    case 'object':
                        if (Array.isArray(propertyValue)) {

                            obj[key] = propertyValue.map(
                                prop => evalProperties(document, prop)
                            )
                            return obj;
                        } else {
                            obj[key] = evalProperties(document, propertyValue);
                            return obj;
                        }
                    default:
                        return obj;
                }
            }, node)
    } else {
        return node;
    }

}

export interface BuildOpenAPIPathParams<RequestType, ResponseType> {
    requestBody?: Function,
    responseBody?: Function,
    responses?: {
        200?: ResponseType,
    } & OpenAPIV3.ResponsesObject,
    response?: ResponseType,
    example?: RequestType
    tags?: string[]
    description?: string,

}

export enum ContentType {
    'JSON' = 'application/json',
    'XML' = 'application/xml',
    'TEXT' = 'application/text'
}

export function buildRequestBody<T>(bodyClass: Function, params: {example?: T, isArray?: boolean} = {}): (document: OpenAPIV3Doc) => OpenAPIV3.RequestBodyObject {
    return (document: OpenAPIV3Doc) => {
        const object = getObjectByClass(bodyClass);
        if (object) {
            maybeAddObjectToSchema(document, object, "components/schemas");
            return {
                description: object.description,
                content: buildContent(object, params),
                required: true
            }

        } else {
            throw new Error(`Failed to build request body. Object ${bodyClass.name} is not mapped.`);
        }
    }
}

export function buildResponseBody<T>(bodyClass: Function, params: Pick<OpenAPIV3.ResponseObject, 'headers' | 'description' | 'links'> & { example?: T, isArray?: boolean}): (document: OpenAPIV3Doc) => OpenAPIV3.ResponseObject {
    return (document: OpenAPIV3Doc) => {
        const object = getObjectByClass(bodyClass);
        if (object) {
            maybeAddObjectToSchema(document, object, "components/schemas");
            return {
                content: buildContent(object, {
                    example: params.example,
                    isArray: params.isArray
                }),

                headers: params.headers,
                description: params.description,
                links: params.links
            }

        } else {
            throw new Error(`Failed to build response body. Object ${bodyClass.name} is not mapped.`);
        }
    }
}

function buildContent(object: MetadataObject, params: { example?: any, isArray?: boolean,  } = {}): { [media: string]: OpenAPIV3.MediaTypeObject; } {
    let content;

    if (params.isArray) {
        content = {
            schema: {
                type: "array",
                items: {
                    $ref: `#/components/schemas/${object.name}`
                }
            },
            example: params.example
        }
    } else {
        content = {
            schema: {
                type: 'object',
                $ref: `#/components/schemas/${object.name}`
            },
            example: params.example
        }
    }
    
    return {
        //TODO: Make parameterized
        'application/json': <OpenAPIV3.MediaTypeObject>{
            ...content
        }
    }
}

function bootstrap(document: OpenAPIV3Doc): OpenAPIV3Doc {
    if (!document.components) {
        document.components = { schemas: {} }
    } else if (!document.components.schemas) {
        document.components.schemas = {}
    }

    return document;
}
