"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPayload = exports.PhotoPayload = exports.PostPayload = void 0;
const openapi_decorators_1 = require("../../lib/openapi.decorators");
let PostPayload = class PostPayload {
};
__decorate([
    openapi_decorators_1.OpenAPI.Int32(),
    __metadata("design:type", Number)
], PostPayload.prototype, "id", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.String(),
    __metadata("design:type", String)
], PostPayload.prototype, "text", void 0);
PostPayload = __decorate([
    openapi_decorators_1.OpenAPI.Schema({ name: 'Post' })
], PostPayload);
exports.PostPayload = PostPayload;
let PhotoPayload = class PhotoPayload {
};
__decorate([
    openapi_decorators_1.OpenAPI.Int32(),
    __metadata("design:type", Number)
], PhotoPayload.prototype, "id", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.Binary(),
    __metadata("design:type", String)
], PhotoPayload.prototype, "data", void 0);
PhotoPayload = __decorate([
    openapi_decorators_1.OpenAPI.Schema({ name: 'Photo' })
], PhotoPayload);
exports.PhotoPayload = PhotoPayload;
let UserPayload = class UserPayload {
};
__decorate([
    openapi_decorators_1.OpenAPI.Int32(),
    __metadata("design:type", Number)
], UserPayload.prototype, "id", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.String(),
    __metadata("design:type", String)
], UserPayload.prototype, "name", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.Int32(),
    __metadata("design:type", Number)
], UserPayload.prototype, "age", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.OneToOne(() => PhotoPayload),
    __metadata("design:type", PhotoPayload)
], UserPayload.prototype, "photo", void 0);
__decorate([
    openapi_decorators_1.OpenAPI.OneToMany(() => PostPayload),
    __metadata("design:type", Array)
], UserPayload.prototype, "posts", void 0);
UserPayload = __decorate([
    openapi_decorators_1.OpenAPI.Schema({ name: 'User' })
], UserPayload);
exports.UserPayload = UserPayload;
//# sourceMappingURL=types.js.map