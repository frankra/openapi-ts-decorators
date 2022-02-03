import { expect } from "chai";
import { generateJSONSchema } from "../lib/jsonschema.generator";

describe('JSON Schema Generator', () => {
    it('should generate the jsonschema out of the metadata', () => {

        const schema = generateJSONSchema();

        expect(JSON.stringify(schema, null, 4)).to.be.deep.eq(JSON.stringify({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "definitions": {
                "User": {
                    "type": "object",
                    "properties": {
                        "createdAt": {
                            "type": "string",
                            "format": "date-time"
                        },
                        "createdBy": {
                            "type": "number",
                            "format": "int32"
                        },
                        "id": {
                            "type": "number",
                            "format": "int32"
                        },
                        "name": {
                            "type": "string",
                            "format": "string"
                        },
                        "email": {
                            "type": "string",
                            "format": "string"
                        },
                        "age": {
                            "type": "number",
                            "format": "int32"
                        },
                        "photo": {
                            "type": "object",
                            "$ref": "#/definitions/Photo"
                        },
                        "posts": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Post"
                            }
                        }
                    },
                    "required": [
                        "id",
                        "name",
                        "email"
                    ]
                },
                "Photo": {
                    "type": "object",
                    "properties": {
                        "createdAt": {
                            "type": "string",
                            "format": "date-time"
                        },
                        "createdBy": {
                            "type": "number",
                            "format": "int32"
                        },
                        "id": {
                            "description": "Photo Unique Identifier",
                            "type": "number",
                            "format": "int32"
                        },
                        "data": {
                            "type": "string",
                            "format": "binary"
                        },
                        "owner": {
                            "type": "object",
                            "$ref": "#/definitions/User"
                        }
                    },
                    "required": [
                        "id",
                        "data",
                        "owner"
                    ]
                },
                "Post": {
                    "type": "object",
                    "properties": {
                        "createdAt": {
                            "type": "string",
                            "format": "date-time"
                        },
                        "createdBy": {
                            "type": "number",
                            "format": "int32"
                        },
                        "id": {
                            "description": "Post Unique Identifier",
                            "type": "number",
                            "format": "int32"
                        },
                        "text": {
                            "description": "Post Content",
                            "type": "string",
                            "format": "string"
                        },
                        "author": {
                            "type": "object",
                            "$ref": "#/definitions/User"
                        }
                    },
                    "required": [
                        "id",
                        "text",
                        "author"
                    ]
                }
            }
        }, null, 4));
    })
})