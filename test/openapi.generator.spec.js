"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const openapi_generator_1 = require("../lib/openapi.generator");
const types_1 = require("./fixture/types");
describe('OpenAPI Generator', () => {
    it('should generate the openapi spec and replace classes for definitions', () => {
        const res = (0, openapi_generator_1.generateOpenAPISpec)({
            openapi: '3.0.0',
            info: {
                title: 'Test API',
                version: 'v1.0'
            },
            paths: {
                '/api/v1': (0, openapi_generator_1.pathFactory)({
                    method: 'post',
                    body: types_1.UserPayload,
                    responses: {
                        400: {
                            description: "Invalid ID supplied",
                            content: {}
                        },
                    }
                })
            }
        });
        (0, chai_1.expect)(JSON.stringify(res, null, 4)).to.be.deep.eq(JSON.stringify({
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
    });
});
//# sourceMappingURL=openapi.generator.spec.js.map