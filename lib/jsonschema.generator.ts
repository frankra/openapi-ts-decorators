
import { getMetadata, getObjectByClass, MetadataObject, MetadataObjectProperty } from "./metadata";

const PATH_SPLITTER = '/';

export function generateJSONSchema(path: string = "definitions", bootstrap: any = {}): any {
    const metadata = getMetadata();
    const schema = {
        ...bootstrapSchema('definitions'),
        ...bootstrap
    }

    return Object.values(metadata).reduce((schema, object) => {
        return maybeAddObjectToSchema(schema, <MetadataObject>object, path)
    }, schema);
}


function bootstrapSchema(path: string) {
    return {
        $schema: "http://json-schema.org/draft-07/schema#",
        [path]: {}
    }
}

function getObjectAtPath(schema: any, path: string, objectName: string): any {
    if (path.indexOf(PATH_SPLITTER) >= 0) {
        const parts = path.split(PATH_SPLITTER)
        const lastNode = findNodeDeep(schema, <string>parts.shift(), parts.join(PATH_SPLITTER));
        return lastNode[objectName];
    } else {
        return schema[path][objectName];
    }
}

function findNodeDeep(currentNode: any, currentPath: string, nextPath: string): any{
    if (!currentNode || !currentPath) {
        return null;
    } else if (nextPath) {
        const parts = nextPath.split(PATH_SPLITTER)
        return findNodeDeep(currentNode[currentPath], <string>parts.shift(), parts.join(PATH_SPLITTER))
    } else {
        return currentNode[currentPath];
    }
}


function placeObjectAtPath(schema: any, path: string, objectName: string, object: any): any {
    if (path.indexOf(PATH_SPLITTER) >= 0) {
        const parts = path.split(PATH_SPLITTER)
        const lastNode = findNodeDeep(schema, <string>parts.shift(), parts.join(PATH_SPLITTER));
        lastNode[objectName] = object;
    } else {
        schema[path][objectName] = object;
    }
    return object;
}


export function maybeAddObjectToSchema(schema: any, object: MetadataObject, path: string): any {
    const exists = getObjectAtPath(schema, path, object.name)
    if (!exists && object.type) {
        schema = addObjectToSchema(schema, object, path);
    }
    return schema;
}

function addObjectToSchema(schema: any, object: MetadataObject, path: string): any {
    const newObject = placeObjectAtPath(schema, path, object.name, {
        type: 'object'
    })
    const attributes = Object.keys(object).reduce((res: any, key) => {
        switch (key) {
            case 'properties':
                const objectProperties = convertObjectProperties(schema, object, path)
                const allProperties = addInheritedProperties(schema, objectProperties, object.target, path)

                return {
                    ...res,
                    ...allProperties
                }
            default:
                return res;
        }
    }, {})

    placeObjectAtPath(schema, path, object.name, {
        ...newObject,
        ...attributes
    })
    return schema;
}

function addInheritedProperties(schema: any, props: PropertyMapAndRequiredArray, clazz: Function, path: string): PropertyMapAndRequiredArray {
    let extendedPrototype = Object.getPrototypeOf(clazz);
    let extendedObject = extendedPrototype.name ? getObjectByClass(extendedPrototype) : null;

    if (extendedObject) {
        const inherited = convertObjectProperties(schema, extendedObject, path);
        const newProps: PropertyMapAndRequiredArray = {
            properties: {
                ...inherited.properties,
                ...props.properties
            },
            required: inherited.required.concat(props.required)
        }
        return addInheritedProperties(schema, newProps, extendedPrototype, path)
    } else {
        return props;
    }
}

type PropertyMapAndRequiredArray = { properties: any, required: string[] };

function convertObjectProperties(schema: any, object: MetadataObject, path: string): PropertyMapAndRequiredArray {
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
                    maybeAddObjectToSchema(schema, object, path)
                    return {
                        $ref: `#/${path}/${object.name}`
                    }
                });

                property = {
                    type: config.relationType,
                    minItems: config.minItems
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
                    format: config.format,
                    minLength: config.minLength,
                    maxLength: config.maxLength
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