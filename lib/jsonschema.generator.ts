
import { getMetadata, getObjectByClass, MetadataObject, MetadataObjectProperty } from "./metadata";

export function generateJSONSchema(): any {
    const metadata = getMetadata();
    const path = 'definitions';
    const schema = bootstrapSchema('definitions');

    return Object.values(metadata).reduce((schema, object) => {
        return maybeAddObjectToSchema(schema, <MetadataObject>object, path)
    }, schema);
}


function bootstrapSchema(path: string) {
    return {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        [path]: {}
    }
}

function maybeAddObjectToSchema(schema: any, object: MetadataObject, path: string): any {
    const exists = schema[path][object.name]
    if (!exists && object.type) {
        schema = addObjectToSchema(schema, object, path);
    }
    return schema;
}

function addObjectToSchema(schema: any, object: MetadataObject, path: string): any {
    const newObject = schema[path][object.name] = {
        type: 'object'
    }
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

    schema[path][object.name] = {
        ...newObject,
        ...attributes
    }
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