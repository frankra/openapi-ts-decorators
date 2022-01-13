import { mapObject, mapProperty, MetadataObjectType } from "./metadata";

export type ClassDecorator = (constructor: Function) => void
export type PropertyDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any


export interface PropertyDecoratorParams {
    description?: string
}

export interface ObjectDecoratorParams {
    name?: string
}

export module OpenAPI {
    // Number formats
    export function Int32(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('number', 'int32', params);
    }
    export function Int64(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('number', 'int64', params);
    }
    export function Float(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('number', 'float', params);
    }
    export function Double(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('number', 'double', params);
    }
    // String format
    export function String(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'string', params);
    }
    // Raw formats
    export function Byte(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'byte', params);
    }
    export function Binary(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'binary', params);
    }
    // Boolean format
    export function Boolean(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('boolean', 'boolean', params);
    }
    // Date formats
    export function Date(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'date', params);
    }
    export function DateTime(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'date-time', params);
    }
    export function Password(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation('string', 'password', params);
    }

    // Relations
    export function OneToOne(relationTo: ()=> Function, params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyRelation('object', relationTo, params);
    }

    export function OneToMany(relationTo: ()=> Function, params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyRelation('array', relationTo, params);
    }

    // Not Supported Yet
    // export function OneOf(relationTo: ()=> Function, params: PropertyDecoratorParams = {}): Function {
    //     return getMapPropertyRelation('oneOf', relationTo, params);
    // }

    // export function AllOf(relationTo: ()=> Function, params: PropertyDecoratorParams = {}): Function {
    //     return getMapPropertyRelation('allOf', relationTo, params);
    // }

    // export function AnyOf(relationTo: ()=> Function[], params: PropertyDecoratorParams = {}): Function {
    //     return getMapPropertyRelation('anyOf', relationTo, params);
    // }

    function getMapPropertyRelation(relationType: string, targetRelation: Function, params: PropertyDecoratorParams): Function {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            mapProperty(target.constructor.name, propertyKey, {
                ...params,
                type: 'relation',
                relationType,
                targetRelation
            });
        };
    }

    function getMapPropertyAnnotation(type: string, format: string, params: PropertyDecoratorParams): Function {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            mapProperty(target.constructor.name, propertyKey, {
                ...params,
                format,
                type
            });
        };
    }

    export function Schema(params: ObjectDecoratorParams = {}): ClassDecorator {
        return getMapObjectAnnotation(MetadataObjectType.SCHEMA, params)
    }

    function getMapObjectAnnotation(type: MetadataObjectType, params: ObjectDecoratorParams): ClassDecorator {
        return (constructor: Function) => {
            mapObject(type, {
                key: constructor.name,
                name: params.name || constructor.name
            })
        }
    }
   
}