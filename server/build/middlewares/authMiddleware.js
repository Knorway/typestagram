"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportAuth = exports.jwtAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const token_1 = require("../lib/token");
const url_1 = require("../config/url");
const jwtAuth = (req, res, next) => {
    return passport_1.default.authenticate('jwt', { session: false }, (error, user) => {
        const authError = error || !user;
        if (authError)
            res.status(401);
        if (user)
            req.user = user;
        next(authError && new Error('유저 인증 권한 획득에 실패했습니다.'));
    })(req, res, next);
};
exports.jwtAuth = jwtAuth;
const passportAuth = (provider) => {
    return express_async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        passport_1.default.authenticate(provider, { session: false }, (error, user) => {
            if (error) {
                res.status(400);
                console.error(error);
                throw new Error(`${provider} oauth strategy callback error`);
            }
            const token = token_1.generateToken(user.uuid);
            res.redirect(url_1.CLIENT_URL + `/authredirect?with=${token}`);
        })(req, res, next);
    }));
};
exports.passportAuth = passportAuth;
//# sourceMappingURL=authMiddleware.js.map