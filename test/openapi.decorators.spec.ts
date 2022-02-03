import { expect } from "chai";
import { getMetadata } from "../lib/metadata";

describe('OpenAPI Decorators', () => {
    it('should map decorated classes', () => {
        const metadata = getMetadata();

        expect(JSON.stringify(metadata, null, 4)).to.be.deep.eq(JSON.stringify({
            "EntityMetadata": {
                "key": "EntityMetadata",
                "name": "EntityMetadata",
                "properties": {
                    "createdAt": {
                        "key": "createdAt",
                        "name": "createdAt",
                        "format": "date-time",
                        "type": "string"
                    },
                    "createdBy": {
                        "key": "createdBy",
                        "name": "createdBy",
                        "format": "int32",
                        "type": "number"
                    }
                }
            },
            "UserPayload": {
                "key": "UserPayload",
                "name": "User",
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "required": true,
                        "format": "int32",
                        "type": "number"
                    },
                    "name": {
                        "key": "name",
                        "name": "name",
                        "required": true,
                        "minLength": 10,
                        "maxLength": 100,
                        "type": "string"
                    },
                    "email": {
                        "key": "email",
                        "name": "email",
                        "required": true,
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
                        "minItems": 1,
                        "type": "relation",
                        "relationType": "array"
                    }
                },
                "type": "schema"
            },
            "PostPayload": {
                "key": "PostPayload",
                "name": "Post",
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "required": true,
                        "description": "Post Unique Identifier",
                        "format": "int32",
                        "type": "number"
                    },
                    "text": {
                        "key": "text",
                        "name": "text",
                        "required": true,
                        "description": "Post Content",
                        "type": "string"
                    },
                    "author": {
                        "key": "author",
                        "name": "author",
                        "required": true,
                        "description": "User who created the post",
                        "type": "relation",
                        "relationType": "object"
                    }
                },
                "type": "schema"
            },
            "PhotoPayload": {
                "key": "PhotoPayload",
                "name": "Photo",
                "properties": {
                    "id": {
                        "key": "id",
                        "name": "id",
                        "required": true,
                        "description": "Photo Unique Identifier",
                        "format": "int32",
                        "type": "number"
                    },
                    "data": {
                        "key": "data",
                        "name": "data",
                        "required": true,
                        "format": "binary",
                        "type": "string"
                    },
                    "owner": {
                        "key": "owner",
                        "name": "owner",
                        "required": true,
                        "description": "User who the Photo belongs to",
                        "type": "relation",
                        "relationType": "object"
                    }
                },
                "type": "schema"
            }
        }, null, 4));
    })
})