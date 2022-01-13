export enum MetadataObjectType {
    SCHEMA = 'schema',
    ERROR = 'error',
}

export interface MetadataObject<T = MetadataObjectType> {
    key: string,
    type: T,
    properties: {
        [key: string]: MetadataObjectProperty
    }
}

export interface MetadataObjectProperty {
    key: string
}

export interface Metadata {
    [key: string]: Partial<MetadataObject<MetadataObjectType>>
}

let metadata: Metadata = {};

export function getMetadata(): any {
    return metadata;
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