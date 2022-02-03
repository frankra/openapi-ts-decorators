export enum MetadataObjectType {
    SCHEMA = 'schema',
    ERROR = 'error',
}

export interface MetadataObject<T = MetadataObjectType> {
    key: string,
    type: T,
    name: string,
    description?: string,
    target: Function,
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
    minLength?: number,
    maxLength?: number,
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

export function mapObject(target: Function, type: MetadataObjectType, data: { name?: string }) {
    const nodeKey = target.name;
    const node = metadata[nodeKey];
    
    if (node) {
        metadata[nodeKey] = {
            ...node,
            ...data,
            type,
            target
        }
    } else {
        metadata[nodeKey] = {
            ...data,
            type,
            target,
            properties: {}
        };
    }
}

export function mapProperty(target: Function, key: string, params: any) {
    const nodeKey = target.name;
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
            key: nodeKey,
            name: nodeKey,
            target,
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