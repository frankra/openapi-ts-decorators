import { expect } from "chai";
import { generateJSONSchema } from "../lib/jsonschema.generator";

describe('JSON Schema Generator', () => {
    it('should generate the jsonschema out of the metadata', () => {

        const schema = generateJSONSchema();

        expect(JSON.stringify(schema, null, 4)).to.be.deep.eq(JSON.stringify({
            "$schema": "http://json-schema.org/draft-07/schema#",
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
                            "minLength": 10,
                            "maxLength": 100
                        },
                        "email": {
                            "type": "string"
                        },
                        "age": {
                            "type": "number",
                            "format": "int32",
                            "minimum": 18,
                            "maximum": 100
                        },
                        "role": {
                            "type": "number",
                            "format": "int32",
                            "enum": [
                                10,
                                20,
                                30
                            ]
                        },
                        "language": {
                            "type": "string",
                            "enum": [
                                "de",
                                "en",
                                "pt",
                                "es",
                                "pl"
                            ]
                        },
                        "photo": {
                            "type": "object",
                            "$ref": "#/definitions/Photo"
                        },
                        "posts": {
                            "type": "array",
                            "minItems": 1,
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
                            "type": "string"
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