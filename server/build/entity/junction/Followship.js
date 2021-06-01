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
exports.Followship = void 0;
const typeorm_1 = require("typeorm");
const baseModel_1 = require("../baseModel");
const User_1 = require("../User");
let Followship = class Followship extends baseModel_1.BaseModel {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Followship.prototype, "followerId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.followers, {
        primary: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'followerId' }),
    __metadata("design:type", User_1.User)
], Followship.prototype, "follower", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Followship.prototype, "followingId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.followings, {
        primary: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'followingId' }),
    __metadata("design:type", User_1.User)
], Followship.prototype, "following", void 0);
Followship = __decorate([
    typeorm_1.Entity()
], Followship);
exports.Followship = Followship;
//# sourceMappingURL=Followship.js.map