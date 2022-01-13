import { OpenAPIV3 } from "openapi-types";
import { getMetadata, MetadataObject } from "./metadata";
import { OpenAPIV3Doc, PathObjectFactory, PathsObjectFactoryMap } from "./openapi.types";

export function generateOpenAPISpec(apiDocJson: OpenAPIV3Doc): OpenAPIV3.Document {
    apiDocJson = bootstrap(apiDocJson);
    return <OpenAPIV3.Document>Object.keys(apiDocJson).reduce((doc, key) => {
        switch (key) {
            case 'paths':
                return evaluatePaths(doc, doc.paths)
            default:
                return doc;
        }
    }, apiDocJson)

}

function evaluatePaths(document: OpenAPIV3Doc, paths: OpenAPIV3.PathsObject | PathsObjectFactoryMap): OpenAPIV3Doc {
    <OpenAPIV3.PathsObject>Object.keys(paths).reduce((paths, key) => {
        if (typeof paths[key] === 'function') {
            paths[key] = (<PathObjectFactory>paths[key])(document);
        }
        return paths;
    }, paths);

    return document;
}

export interface BuildOpenAPIPathParams {
    method: string,
    body: Function,
    description?: string,
    responses: any
}

export function pathFactory(params: BuildOpenAPIPathParams): (document: OpenAPIV3Doc) => OpenAPIV3.PathItemObject {
    return (document: OpenAPIV3Doc) => {
        const object = getMetadata()[params.body.name];
        if (object) {
            maybeAddObjectToSchema(document, object);

            return {
                [params.method]: {
                    requestBody: {
                        description: params.description,
                        content: {
                            //TODO: Make parameterized
                            'application/json': {
                                schema: {
                                    '$ref': `#/components/schemas/${object.name}`
                                }
                            }
                        },
                        required: true
                    },
                    responses: params.responses
                }
            }
        } else {
            throw new Error(`Failed to generate path. Object ${params.body.name} is not mapped.`);
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

function maybeAddObjectToSchema(document: any, object: any): any {
    const exists = document.components.schemas[object.name];
    if (!exists) {
        document = addObjectToDocumentSchema(document, object);
    }
    return document;
}

function addObjectToDocumentSchema(document: any, object: any): any {
    document.components.schemas[object.name] = {
        type: 'object',
        ...Object.keys(object).reduce((res: any, key) => {
            switch (key) {
                case 'properties':
                    return {
                        ...res,
                        ...convertObjectProperties(document, object)
                    }
                default:
                    return res;
            }
        }, {})
    }
    return document;
}

function convertObjectProperties(document: any, object: MetadataObject<any>) {
    const properties = object.properties;
    if (properties) {
        const required: string[] = [];

        const mappedProps = Object.keys(properties).reduce((props: any, key: string) => {
            const config: any = properties[key];
            let property: any;
            if (config.type === 'relation') {
                let types = config.targetRelation();
                types = Array.isArray(types) ? types : [types];

                const references = types.map((type: any) => {
                    const object = getMetadata()[type.name];
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
                    property.$ref = references.pop().$ref;
                }

            } else {
                property = {
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
            required: required.length > 0 ? required : undefined
        }
    } else {
        return {};
    }
}