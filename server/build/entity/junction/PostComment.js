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
exports.PostComment = void 0;
const typeorm_1 = require("typeorm");
const baseModel_1 = require("../baseModel");
const Post_1 = require("../Post");
const User_1 = require("../User");
let PostComment = class PostComment extends baseModel_1.BaseModel {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], PostComment.prototype, "comment", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], PostComment.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.comments, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], PostComment.prototype, "user", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], PostComment.prototype, "postId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Post_1.Post, (post) => post.comments, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'postId' }),
    __metadata("design:type", User_1.User)
], PostComment.prototype, "post", void 0);
PostComment = __decorate([
    typeorm_1.Entity()
], PostComment);
exports.PostComment = PostComment;
//# sourceMappingURL=PostComment.js.map