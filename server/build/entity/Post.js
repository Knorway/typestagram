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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const baseModel_1 = require("./baseModel");
const PostHashtag_1 = require("./junction/PostHashtag");
const User_1 = require("./User");
const Like_1 = require("../entity/junction/Like");
const PostComment_1 = require("./junction/PostComment");
let Post = class Post extends baseModel_1.BaseModel {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "img", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.posts),
    typeorm_1.JoinTable({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Post.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany((type) => PostHashtag_1.PostHashtag, (postHashtag) => postHashtag.post, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Post.prototype, "hashtags", void 0);
__decorate([
    typeorm_1.OneToMany((type) => PostComment_1.PostComment, (comment) => comment.post, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Like_1.Like, (like) => like.post, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "likes", void 0);
Post = __decorate([
    typeorm_1.Entity()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map