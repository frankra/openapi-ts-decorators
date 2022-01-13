"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProperty = exports.mapObject = exports.getMetadata = exports.MetadataObjectType = void 0;
var MetadataObjectType;
(function (MetadataObjectType) {
    MetadataObjectType["SCHEMA"] = "schema";
    MetadataObjectType["ERROR"] = "error";
})(MetadataObjectType = exports.MetadataObjectType || (exports.MetadataObjectType = {}));
let metadata = {};
function getMetadata() {
    return metadata;
}
exports.getMetadata = getMetadata;
function mapObject(type, data) {
    const node = metadata[data.key];
    if (node) {
        metadata[data.key] = {
            ...node,
            ...data,
            type
        };
    }
    else {
        metadata[data.key] = { ...data, type, properties: {} };
    }
}
exports.mapObject = mapObject;
function mapProperty(nodeKey, key, params) {
    const node = metadata[nodeKey];
    if (node) {
        node.properties = {
            ...node.properties
        };
        node.properties[key] = {
            key,
            name: params[params.name] || key,
            ...params
        };
    }
    else {
        metadata[nodeKey] = {
            properties: {
                [key]: {
                    key,
                    name: params[params.name] || key,
                    ...params
                }
            }
        };
    }
}
exports.mapProperty = mapProperty;
//# sourceMappingURL=metadata.js.map