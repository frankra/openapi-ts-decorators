"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPI = void 0;
const metadata_1 = require("./metadata");
var OpenAPI;
(function (OpenAPI) {
    // Number formats
    function Int32(params = {}) {
        return getMapPropertyAnnotation('number', 'int32', params);
    }
    OpenAPI.Int32 = Int32;
    function Int64(params = {}) {
        return getMapPropertyAnnotation('number', 'int64', params);
    }
    OpenAPI.Int64 = Int64;
    function Float(params = {}) {
        return getMapPropertyAnnotation('number', 'float', params);
    }
    OpenAPI.Float = Float;
    function Double(params = {}) {
        return getMapPropertyAnnotation('number', 'double', params);
    }
    OpenAPI.Double = Double;
    // String format
    function String(params = {}) {
        return getMapPropertyAnnotation('string', 'string', params);
    }
    OpenAPI.String = String;
    // Raw formats
    function Byte(params = {}) {
        return getMapPropertyAnnotation('string', 'byte', params);
    }
    OpenAPI.Byte = Byte;
    function Binary(params = {}) {
        return getMapPropertyAnnotation('string', 'binary', params);
    }
    OpenAPI.Binary = Binary;
    // Boolean format
    function Boolean(params = {}) {
        return getMapPropertyAnnotation('boolean', 'boolean', params);
    }
    OpenAPI.Boolean = Boolean;
    // Date formats
    function Date(params = {}) {
        return getMapPropertyAnnotation('string', 'date', params);
    }
    OpenAPI.Date = Date;
    function DateTime(params = {}) {
        return getMapPropertyAnnotation('string', 'date-time', params);
    }
    OpenAPI.DateTime = DateTime;
    function Password(params = {}) {
        return getMapPropertyAnnotation('string', 'password', params);
    }
    OpenAPI.Password = Password;
    // Relations
    function OneToOne(relationTo, params = {}) {
        return getMapPropertyRelation('object', relationTo, params);
    }
    OpenAPI.OneToOne = OneToOne;
    function OneToMany(relationTo, params = {}) {
        return getMapPropertyRelation('array', relationTo, params);
    }
    OpenAPI.OneToMany = OneToMany;
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
    function getMapPropertyRelation(relationType, targetRelation, params) {
        return (target, propertyKey, descriptor) => {
            (0, metadata_1.mapProperty)(target.constructor.name, propertyKey, {
                ...params,
                type: 'relation',
                relationType,
                targetRelation
            });
        };
    }
    function getMapPropertyAnnotation(type, format, params) {
        return (target, propertyKey, descriptor) => {
            (0, metadata_1.mapProperty)(target.constructor.name, propertyKey, {
                ...params,
                format,
                type
            });
        };
    }
    function Schema(params = {}) {
        return getMapObjectAnnotation(metadata_1.MetadataObjectType.SCHEMA, params);
    }
    OpenAPI.Schema = Schema;
    function getMapObjectAnnotation(type, params) {
        return (constructor) => {
            (0, metadata_1.mapObject)(type, {
                key: constructor.name,
                name: params.name || constructor.name
            });
        };
    }
})(OpenAPI = exports.OpenAPI || (exports.OpenAPI = {}));
//# sourceMappingURL=openapi.decorators.js.map