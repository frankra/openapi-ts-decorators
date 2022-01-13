"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathFactory = exports.generateOpenAPISpec = void 0;
const metadata_1 = require("./metadata");
function generateOpenAPISpec(apiDocJson) {
    apiDocJson = bootstrap(apiDocJson);
    return Object.keys(apiDocJson).reduce((doc, key) => {
        switch (key) {
            case 'paths':
                return evaluatePaths(doc, doc.paths);
            default:
                return doc;
        }
    }, apiDocJson);
}
exports.generateOpenAPISpec = generateOpenAPISpec;
function evaluatePaths(document, paths) {
    Object.keys(paths).reduce((paths, key) => {
        if (typeof paths[key] === 'function') {
            paths[key] = paths[key](document);
        }
        return paths;
    }, paths);
    return document;
}
function pathFactory(params) {
    return (document) => {
        const object = (0, metadata_1.getMetadata)()[params.body.name];
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
            };
        }
        else {
            throw new Error(`Failed to generate path. Object ${params.body.name} is not mapped.`);
        }
    };
}
exports.pathFactory = pathFactory;
function bootstrap(document) {
    if (!document.components) {
        document.components = { schemas: {} };
    }
    else if (!document.components.schemas) {
        document.components.schemas = {};
    }
    return document;
}
function maybeAddObjectToSchema(document, object) {
    const exists = document.components.schemas[object.name];
    if (!exists) {
        document = addObjectToDocumentSchema(document, object);
    }
    return document;
}
function addObjectToDocumentSchema(document, object) {
    document.components.schemas[object.name] = {
        type: 'object',
        ...Object.keys(object).reduce((res, key) => {
            switch (key) {
                case 'properties':
                    return {
                        ...res,
                        ...convertObjectProperties(document, object)
                    };
                default:
                    return res;
            }
        }, {})
    };
    return document;
}
function convertObjectProperties(document, object) {
    const properties = object.properties;
    if (properties) {
        const required = [];
        const mappedProps = Object.keys(properties).reduce((props, key) => {
            const config = properties[key];
            let property;
            if (config.type === 'relation') {
                let types = config.targetRelation();
                types = Array.isArray(types) ? types : [types];
                const references = types.map((type) => {
                    const object = (0, metadata_1.getMetadata)()[type.name];
                    maybeAddObjectToSchema(document, object);
                    return {
                        $ref: `#/components/schemas/${object.name}`
                    };
                });
                property = {
                    type: config.relationType
                };
                if (config.relationType === 'array') {
                    property.items = references.pop();
                }
                else {
                    property.$ref = references.pop().$ref;
                }
            }
            else {
                property = {
                    type: config.type,
                    format: config.format
                };
            }
            props[key] = property;
            if (config.required) {
                required.push(key);
            }
            return props;
        }, {});
        return {
            properties: mappedProps,
            required: required.length > 0 ? required : undefined
        };
    }
    else {
        return {};
    }
}
//# sourceMappingURL=openapi.generator.js.map