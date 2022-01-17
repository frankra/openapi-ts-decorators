import { expect } from "chai";
import { getMetadata } from "../lib/metadata";

describe('OpenAPI Decorators', () => {
    it('should map decorated classes', () => {
        const metadata = getMetadata();

        expect(JSON.stringify(metadata, null, 4)).to.be.deep.eq(JSON.stringify({
            "UserPayload": {
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
                        "format": "string",
                        "type": "string"
                    },
                    "email": {
                        "key": "email",
                        "name": "email",
                        "required": true,
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
            },
            "PostPayload": {
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
                        "format": "string",
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
                "key": "PostPayload",
                "name": "Post",
                "type": "schema"
            },
            "PhotoPayload": {
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
                "key": "PhotoPayload",
                "name": "Photo",
                "type": "schema"
            }
        }, null, 4));
    })
})