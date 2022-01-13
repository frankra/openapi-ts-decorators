"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../lib/metadata");
const chai_1 = require("chai");
describe('OpenAPI Decorators', () => {
    it('should map decorated classes', () => {
        const metadata = (0, metadata_1.getMetadata)();
        (0, chai_1.expect)(JSON.stringify(metadata, null, 4)).to.be.deep.eq(JSON.stringify({
            "PostPayload": {
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "format": "int32",
                        "type": "number"
                    },
                    "text": {
                        "key": "text",
                        "name": "text",
                        "format": "string",
                        "type": "string"
                    }
                },
                "key": "PostPayload",
                "name": "Post",
                "type": "schema"
            },
            "PhotoPayload": {
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "format": "int32",
                        "type": "number"
                    },
                    "data": {
                        "key": "data",
                        "name": "data",
                        "format": "binary",
                        "type": "string"
                    }
                },
                "key": "PhotoPayload",
                "name": "Photo",
                "type": "schema"
            },
            "UserPayload": {
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "format": "int32",
                        "type": "number"
                    },
                    "name": {
                        "key": "name",
                        "name": "name",
                        "format": "string",
                        "type": "string"
                    },
                    "age": {
                        "key": "age",
                        "name": "age",
                        "format": "int32",
                        "type": "number"
                    },
                    "photo": {
                        "key": "photo",
                        "name": "photo",
                        "type": "relation",
                        "relationType": "object"
                    },
                    "posts": {
                        "key": "posts",
                        "name": "posts",
                        "type": "relation",
                        "relationType": "array"
                    }
                },
                "key": "UserPayload",
                "name": "User",
                "type": "schema"
            }
        }, null, 4));
    });
});
//# sourceMappingURL=openapi.decorators.spec.js.map