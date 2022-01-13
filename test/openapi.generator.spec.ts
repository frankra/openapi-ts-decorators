import { expect } from "chai";
import { pathFactory, generateOpenAPISpec } from "../lib/openapi.generator";
import { UserPayload } from "./fixture/types";

describe('OpenAPI Generator', () => {
    it('should generate the openapi spec and replace classes for definitions', () => {

        const res = generateOpenAPISpec({
            openapi: '3.0.0',
            info: {
                title: 'Test API',
                version: 'v1.0'
            },
            paths: {
                '/api/v1': pathFactory({
                    method: 'post',
                    body: UserPayload,
                    responses: {
                        400: {
                            description: "Invalid ID supplied",
                            content: {}
                        },
                    }
                })
            }
        })

        expect(JSON.stringify(res, null, 4)).to.be.deep.eq(JSON.stringify({
            "openapi": "3.0.0",
            "info": {
                "title": "Test API",
                "version": "v1.0"
            },
            "paths": {
                "/api/v1": {
                    "post": {
                        "requestBody": {
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/User"
                                    }
                                }
                            },
                            "required": true
                        },
                        "responses": {
                            "400": {
                                "description": "Invalid ID supplied",
                                "content": {}
                            }
                        }
                    }
                }
            },
            "components": {
                "schemas": {
                    "Photo": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "format": "int32"
                            },
                            "data": {
                                "type": "string",
                                "format": "binary"
                            }
                        }
                    },
                    "Post": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "format": "int32"
                            },
                            "text": {
                                "type": "string",
                                "format": "string"
                            }
                        }
                    },
                    "User": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "format": "int32"
                            },
                            "name": {
                                "type": "string",
                                "format": "string"
                            },
                            "age": {
                                "type": "number",
                                "format": "int32"
                            },
                            "photo": {
                                "type": "object",
                                "$ref": "#/components/schemas/Photo"
                            },
                            "posts": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/Post"
                                }
                            }
                        }
                    }
                }
            }
        }, null, 4));
    })
})