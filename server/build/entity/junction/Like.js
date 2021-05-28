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
exports.Like = void 0;
const typeorm_1 = require("typeorm");
const baseModel_1 = require("../baseModel");
const Post_1 = require("../Post");
const User_1 = require("../User");
let Like = class Like extends baseModel_1.BaseModel {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Like.prototype, "postId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Post_1.Post, (post) => post.likes, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'postId' }),
    __metadata("design:type", Post_1.Post)
], Like.prototype, "post", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Like.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.likedPosts, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Like.prototype, "user", void 0);
Like = __decorate([
    typeorm_1.Entity()
], Like);
exports.Like = Like;
//# sourceMappingURL=Like.js.map