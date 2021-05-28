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
exports.passportStrategies = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const passport_jwt_1 = require("passport-jwt");
const passport_github2_1 = require("passport-github2");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("../entity/User");
const passport_naver_1 = require("passport-naver");
const Followship_1 = require("../entity/junction/Followship");
dotenv_1.default.config();
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const githubOptions = {
    clientID: process.env.GITHUB_CLIENT,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://localhost:4000/auth/github/callback',
};
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback',
};
const naverOptions = {
    clientID: process.env.NAVER_CLIENT,
    clientSecret: process.env.NAVER_SECRET,
    callbackURL: 'http://localhost:4000/auth/naver/callback',
};
const handleOAuthUser = (done, profile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, providerId, username, provider } = profile;
        const exUser = yield User_1.User.findOne({ where: { email } });
        if (exUser) {
            exUser.snsId = providerId;
            exUser.provider = provider;
            exUser.save();
            return done(null, exUser);
        }
        const user = yield User_1.User.create({
            email,
            username: username || email,
            snsId: providerId,
            provider: provider,
        }).save();
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid: payload.id })
            .getOne();
        if (!user) {
            throw new Error('존재하지 않는 계정입니다');
        }
        const followships = yield Followship_1.Followship.createQueryBuilder('flsp')
            .where('flsp.follower = :id', { id: user.id })
            .orWhere('flsp.following = :id', { id: user.id })
            .select(['flsp.followerId', 'flsp.followingId', 'flsp.uuid'])
            .getMany();
        done(null, Object.assign(Object.assign({}, user), { followships }));
    }
    catch (error) {
        console.log('jwt error');
        done(error);
    }
});
const githubVerify = (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { login: username, id: githubId, email, provider } = profile._json;
    handleOAuthUser(done, {
        email,
        username,
        provider: provider || 'github',
        providerId: githubId,
    });
});
const googleVerify = (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { displayName: username, id: googleId, provider } = profile;
    const { email } = profile._json;
    handleOAuthUser(done, {
        email,
        username,
        provider: provider || 'google',
        providerId: googleId,
    });
});
const naverVerify = (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { displayName: username, id: naverId, provider } = profile;
    const { email } = profile._json;
    handleOAuthUser(done, {
        email,
        username,
        provider: provider || 'naver',
        providerId: naverId,
    });
});
const passportStrategies = (passport) => {
    passport.initialize();
    passport.use(new passport_jwt_1.Strategy(jwtOptions, jwtVerify));
    passport.use(new passport_github2_1.Strategy(githubOptions, githubVerify));
    passport.use(new passport_google_oauth20_1.Strategy(googleOptions, googleVerify));
    passport.use(new passport_naver_1.Strategy(naverOptions, naverVerify));
};
exports.passportStrategies = passportStrategies;
//# sourceMappingURL=passport.js.map