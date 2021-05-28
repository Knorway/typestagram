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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = require("../../entity/User");
const token_1 = require("../../lib/token");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default();
// [GET] /auth/register
router.post('/register', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    if (yield User_1.User.findOne({ where: { email } })) {
        res.status(400);
        throw new Error('이미 존재하는 계정입니다');
    }
    const hash = yield bcryptjs_1.default.hash(password, 12);
    const user = yield User_1.User.create({ email, username, password: hash }).save();
    const token = token_1.generateToken(user.uuid);
    res.json(token);
})));
// [POST] /auth/login
router.post('/login', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.User.findOne({
        where: { email },
        select: ['email', 'username', 'password', 'uuid', 'provider'],
    });
    if (!user) {
        res.status(404);
        throw new Error('존재하지 않는 유저입니다');
    }
    if (user.provider !== 'local') {
        res.status(400);
        throw new Error(`해당 소셜 서비스로 가입되어 있는 계정입니다: ${user.provider}`);
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('올바르지 않은 비밀번호 입니다');
    }
    const token = token_1.generateToken(user.uuid);
    res.json(token);
})));
// [GET] /auth/github
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', authMiddleware_1.passportAuth('github'));
// [GET] /auth/google
router.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', authMiddleware_1.passportAuth('google'));
// [GET] /auth/naver
router.get('/naver', passport_1.default.authenticate('naver'));
router.get('/naver/callback', authMiddleware_1.passportAuth('naver'));
// [GET] /auth/validate
router.get('/validate', authMiddleware_1.jwtAuth, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id, email, username, uuid, provider } = req.user!;
    res.json(req.user);
})));
exports.default = router;
//# sourceMappingURL=index.js.map