import { mapObject, mapProperty, MetadataObjectPropertyRelationType, MetadataObjectPropertyType, MetadataObjectType } from "./metadata";

export type ClassDecorator = (constructor: Function) => void
export type PropertyDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any


export interface PropertyDecoratorParams {
    description?: string,
    required?: boolean
}

export interface StringPropertyDecoratorParams extends PropertyDecoratorParams {
    minLength?: number,
    maxLength?: number,
    enum?: string[] | ((ref: any) => object)
}

export interface NumberPropertyDecoratorParams extends PropertyDecoratorParams {
    minimum?: number,
    maximum?: number,
    enum?: number[] | ((ref: any) => object)
}

export interface RelationPropertyDecoratorParams extends PropertyDecoratorParams {
    minItems?: number,
}

export interface ObjectDecoratorParams {
    name?: string,
    description?: string,
}


export module OpenAPI {
    // Number formats
    export function Int32(params: NumberPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.NUMBER, 'int32', params);
    }
    export function Int64(params: NumberPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.NUMBER, 'int64', params);
    }
    export function Float(params: NumberPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.NUMBER, 'float', params);
    }
    export function Double(params: NumberPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.NUMBER, 'double', params);
    }
    // String format
    export function String(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, undefined, params);
    }
    export function Password(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, 'password', params);
    }
    // Raw formats
    export function Byte(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, 'byte', params);
    }
    export function Binary(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, 'binary', params);
    }
    // Boolean format
    export function Boolean(params: PropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.BOOLEAN, undefined, params);
    }
    // Date formats
    export function Date(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, 'date', params);
    }
    export function DateTime(params: StringPropertyDecoratorParams = {}): Function {
        return getMapPropertyAnnotation(MetadataObjectPropertyType.STRING, 'date-time', params);
    }

    // Relations
    export function OneToOne(relationTo: (ref: any) => Function, params: RelationPropertyDecoratorParams = {}): Function {
        return getMapPropertyRelation(MetadataObjectPropertyRelationType.OBJECT, relationTo, params);
    }

    export function OneToMany(relationTo: (ref: any) => Function, params: RelationPropertyDecoratorParams = {}): Function {
        return getMapPropertyRelation(MetadataObjectPropertyRelationType.ARRAY, relationTo, params);
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
        return (target: Function, propertyKey: string, descriptor: PropertyDescriptor) => {
            mapProperty(target.constructor, propertyKey, {
                ...params,
                type: MetadataObjectPropertyType.RELATION,
                relationType,
                targetRelation
            });
        };
    }

    function getMapPropertyAnnotation(type: string, format: string | undefined, params: PropertyDecoratorParams): Function {
        return (target: Function, propertyKey: string, descriptor: PropertyDescriptor) => {
            mapProperty(target.constructor, propertyKey, {
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
            mapObject(constructor, type, {
                name: params.name || constructor.name
            })
        }
    }

}