export enum MetadataObjectType {
    SCHEMA = 'schema',
    ERROR = 'error',
}

export interface MetadataObject<T = MetadataObjectType> {
    key: string,
    type: T,
    name: string,
    description?: string,
    properties: {
        [key: string]: MetadataObjectProperty
    }
}

export enum MetadataObjectPropertyType {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    RELATION = 'relation'
}
export enum MetadataObjectPropertyRelationType {
    ARRAY = 'array',
    OBJECT = 'object'
}
export interface MetadataObjectProperty {
    key: string,
    type: MetadataObjectPropertyType,
    description?: string,
    format?: string,
    targetRelation?: () => Function | Function[],
    required?: boolean,
    relationType: MetadataObjectPropertyRelationType
}

export interface Metadata {
    [key: string]: Partial<MetadataObject<MetadataObjectType>>
}

let metadata: Metadata = {};

export function getMetadata(): Metadata {
    return metadata;
}

export function getObjectByKey(key: string): MetadataObject {
    const obj = getMetadata()[key];
    if (!obj) {
        throw new Error(`Failed to retrieve metadata for: ${key}, is this object annotated?`);
    }
    return <MetadataObject>obj;
}

export function getObjectByClass(clazz: Function): MetadataObject {
    return getObjectByKey(clazz.name);
}

export function mapObject(type: MetadataObjectType, data: { key: string, name?: string }) {
    const node = metadata[data.key];
    if (node) {
        metadata[data.key] = {
            ...node,
            ...data,
            type
        }
    } else {
        metadata[data.key] = { ...data, type, properties: {} };
    }
}

export function mapProperty(nodeKey: string, key: string, params: any) {
    const node = metadata[nodeKey];
    if (node) {
        node.properties = {
            ...node.properties
        }
        node.properties[key] = {
            key,
            name: params[params.name] || key,
            ...params
        }
    } else {
        metadata[nodeKey] = {
            properties: {
                [key]: {
                    key,
                    name: params[params.name] || key,
                    ...params
                }
            }
        }
    }
}