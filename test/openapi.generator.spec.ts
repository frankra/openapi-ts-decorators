import { expect } from "chai";
import { buildRequestBody, buildResponseBody, generateOpenAPISpec } from "../lib/openapi.generator";
import { PostPayload, UserPayload } from "./fixture/types";

describe('OpenAPI Generator', () => {
    it('should generate the openapi spec and replace classes for definitions', () => {

        const res = generateOpenAPISpec({
            openapi: '3.0.0',
            info: {
                title: 'Test API',
                version: 'v1.0',
                description: 'This is the description of the API',
            },
            paths: {
                '/api/v1/Users': {
                    post: {
                        requestBody: buildRequestBody<UserPayload>(UserPayload),
                        responses: {
                            200: buildResponseBody<UserPayload>(UserPayload, {
                                description: 'Success'
                            })
                        }
                    }
                },
                '/api/v1/Users/:id': {
                    put: {
                        description: 'Overwrites the user data with the given payload. All user fields will be changed',
                        requestBody: buildRequestBody<UserPayload>(UserPayload),
                        responses: {
                            200: buildResponseBody<UserPayload>(UserPayload, {
                                description: 'Success'
                            }),
                            401: {
                                description: 'Unauthorized'
                            }
                        }
                    },
                    patch: {
                        description: 'Patches the user data with the given payload. Only the fields sent will be changed',
                        requestBody: buildRequestBody<UserPayload>(UserPayload),
                        responses: {
                            200: buildResponseBody<UserPayload>(UserPayload, {
                                description: 'Success'
                            })
                        }
                    }
                },
                '/api/v1/Posts': {
                    post: {
                        requestBody: buildRequestBody<PostPayload>(PostPayload),
                        responses: {
                            200: buildResponseBody<PostPayload>(PostPayload, {
                                description: 'Success'
                            })
                        }
                    }
                }
            }
        })

        expect(JSON.stringify(res, null, 4)).to.be.deep.eq(JSON.stringify({
            "openapi": "3.0.0",
            "info": {
                "title": "Test API",
                "version": "v1.0",
                "description": "This is the description of the API"
            },
            "paths": {
                "/api/v1/Users": {
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
                            "200": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/User"
                                        }
                                    }
                                },
                                "description": "Success"
                            }
                        }
                    }
                },
                "/api/v1/Users/:id": {
                    "put": {
                        "description": "Overwrites the user data with the given payload. All user fields will be changed",
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
                            "200": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/User"
                                        }
                                    }
                                },
                                "description": "Success"
                            },
                            "401": {
                                "description": "Unauthorized"
                            }
                        }
                    },
                    "patch": {
                        "description": "Patches the user data with the given payload. Only the fields sent will be changed",
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
                            "200": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/User"
                                        }
                                    }
                                },
                                "description": "Success"
                            }
                        }
                    }
                },
                "/api/v1/Posts": {
                    "post": {
                        "requestBody": {
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/Post"
                                    }
                                }
                            },
                            "required": true
                        },
                        "responses": {
                            "200": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/Post"
                                        }
                                    }
                                },
                                "description": "Success"
                            }
                        }
                    }
                }
            },
            "components": {
                "schemas": {
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
                                "$ref": "#/components/schemas/Photo"
                            },
                            "posts": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/Post"
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
                                "$ref": "#/components/schemas/User"
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
                                "$ref": "#/components/schemas/User"
                            }
                        },
                        "required": [
                            "id",
                            "text",
                            "author"
                        ]
                    }
                }
            }
        }, null, 4));
    })
})