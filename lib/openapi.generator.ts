import { OpenAPIV3 } from "openapi-types";
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

export function buildRequestBody<T>(bodyClass: Function, example?: T): (document: OpenAPIV3Doc) => OpenAPIV3.RequestBodyObject {
    return (document: OpenAPIV3Doc) => {
        const object = getObjectByClass(bodyClass);
        if (object) {
            maybeAddObjectToSchema(document, object);
            return {
                description: object.description,
                content: buildContent(object, { example }),
                required: true
            }

        } else {
            throw new Error(`Failed to build request body. Object ${bodyClass.name} is not mapped.`);
        }
    }
}

export function buildResponseBody<T>(bodyClass: Function, params: Pick<OpenAPIV3.ResponseObject, 'headers' | 'description' | 'links'> & { example?: T }): (document: OpenAPIV3Doc) => OpenAPIV3.ResponseObject {
    return (document: OpenAPIV3Doc) => {
        const object = getObjectByClass(bodyClass);
        if (object) {
            maybeAddObjectToSchema(document, object);
            return {
                content: buildContent(object),
                ...params
            }

        } else {
            throw new Error(`Failed to build response body. Object ${bodyClass.name} is not mapped.`);
        }
    }
}

function buildContent(object: MetadataObject, extra: { example?: any } = {}): { [media: string]: OpenAPIV3.MediaTypeObject; } {
    return {
        //TODO: Make parameterized
        'application/json': {
            schema: {
                '$ref': `#/components/schemas/${object.name}`
            },
            ...extra
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

function maybeAddObjectToSchema(document: OpenAPIV3Doc, object: MetadataObject): OpenAPIV3Doc {
    const exists = document.components!.schemas![object.name]
    if (!exists && object.type) {
        document = addObjectToDocumentSchema(document, object);
    }
    return document;
}

function addObjectToDocumentSchema(document: OpenAPIV3Doc, object: MetadataObject): OpenAPIV3Doc {
    const newObject = document.components!.schemas![object.name] = {
        type: 'object'
    }
    const attributes = Object.keys(object).reduce((res: any, key) => {
        switch (key) {
            case 'properties':
                const objectProperties = convertObjectProperties(document, object)
                const allProperties = addInheritedProperties(document, objectProperties, object.target)
                
                return {
                    ...res,
                    ...allProperties
                }
            default:
                return res;
        }
    }, {})

    document.components!.schemas![object.name] = {
        ...newObject,
        ...attributes
    }
    return document;
}

function addInheritedProperties(document: OpenAPIV3Doc, props: PropertyMapAndRequiredArray, clazz: Function): PropertyMapAndRequiredArray {
    let extendedPrototype = Object.getPrototypeOf(clazz);
    let extendedObject = extendedPrototype.name ? getObjectByClass(extendedPrototype) : null;

    if (extendedObject) {
        const inherited = convertObjectProperties(document, extendedObject);
        const newProps: PropertyMapAndRequiredArray = {
            properties: {
                ...inherited.properties,
                ...props.properties
            },
            required: inherited.required.concat(props.required)
        }
        return addInheritedProperties(document, newProps, extendedPrototype)
    } else {
        return props;
    }
}

type PropertyMapAndRequiredArray = { properties: any, required: string[] };

function convertObjectProperties(document: OpenAPIV3Doc, object: MetadataObject): PropertyMapAndRequiredArray {
    const properties = object.properties;
    if (properties) {
        const required: string[] = [];

        const mappedProps = Object.keys(properties).reduce((props: any, key: string) => {
            const config: MetadataObjectProperty = properties[key];
            let property: any;
            if (config.type === 'relation') {
                let types = config.targetRelation!();
                types = Array.isArray(types) ? types : [types];

                const references = types.map((type: Function) => {
                    const object = getObjectByClass(type)
                    maybeAddObjectToSchema(document, object)
                    return {
                        $ref: `#/components/schemas/${object.name}`
                    }
                });

                property = {
                    type: config.relationType
                }

                if (config.relationType === 'array') {
                    property.items = references.pop();
                } else {
                    property.$ref = references.pop()!.$ref;
                }

            } else {
                property = {
                    description: config.description,
                    type: config.type,
                    format: config.format
                }
            }

            props[key] = property;
            if (config.required) {
                required.push(key);
            }

            return props;
        }, {})


        return {
            properties: mappedProps,
            required
        }
    } else {
        return {
            properties: {},
            required: []
        };
    }
}