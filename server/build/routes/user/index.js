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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Followship_1 = require("../../entity/junction/Followship");
const User_1 = require("../../entity/User");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = require("../../config/multer");
const router = express_1.default.Router();
router.use(authMiddleware_1.jwtAuth, (req, res, next) => next());
// [GET] /users/:userId
router.get('/:userId', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: uuid } = req.params;
    const user = yield User_1.User.createQueryBuilder('user')
        .where('user.uuid = :uuid', { uuid })
        .leftJoinAndSelect('user.posts', 'posts')
        .orderBy('posts.createdAt', 'DESC')
        .getOne();
    if (!user) {
        res.status(404);
        throw new Error('유저 어카운트 정보를 가져오는 데 실패했습니다.');
    }
    const followships = yield Followship_1.Followship.createQueryBuilder('flsp')
        .where('flsp.follower = :id', { id: user.id })
        .orWhere('flsp.following = :id', { id: user.id })
        .select(['flsp.followerId', 'flsp.followingId', 'flsp.uuid'])
        .getMany();
    res.json(Object.assign(Object.assign({}, user), { followships }));
})));
// [PUT] /users/:userId
router.put('/:userId', multer_1.imgUpload.single('avatarUrl'), express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const nameExists = yield User_1.User.findOne({ where: { username: req.body.username } });
    if (nameExists && nameExists.username !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.username)) {
        res.status(400);
        throw new Error('이미 존재하는 유저명입니다.');
    }
    const edited = yield User_1.User.update((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, {
        username: req.body.username,
        userInfo: req.body.userInfo,
        avatarUrl: ((_c = req.file) === null || _c === void 0 ? void 0 : _c.location) ? (_d = req.file) === null || _d === void 0 ? void 0 : _d.location : nameExists === null || nameExists === void 0 ? void 0 : nameExists.avatarUrl,
    });
    if (!edited) {
        res.status(400);
        throw new Error('유저정보를 수정하는 데 실패했습니다.');
    }
    res.json(edited);
})));
router.put('/:userId/password', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { password, newPassword, newPasswordConfirm } = req.body;
    if (newPassword !== newPasswordConfirm) {
        res.status(400);
        throw new Error('새로운 비밀번호가 일치하지 않습니다.');
    }
    const user = yield User_1.User.findOne((_e = req.user) === null || _e === void 0 ? void 0 : _e.id, { select: ['password'] });
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        res.status(400);
        throw new Error('기존 비밀번호를 정확히게 입력해주세요.');
    }
    yield User_1.User.update(user, { password: yield bcryptjs_1.default.hash(newPassword, 12) });
    res.json({ success: true });
})));
// [POST] /users/:userId/followship
router.post('/:userId/followship', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    const { userId } = req.params;
    if (((_f = req.user) === null || _f === void 0 ? void 0 : _f.id) === +userId) {
        res.status(400);
        throw new Error('자신은 팔로우 할 수 없습니다.');
    }
    const isFollowed = yield Followship_1.Followship.findOne({
        where: { followerId: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id, followingId: userId },
    });
    if (isFollowed) {
        yield Followship_1.Followship.remove(isFollowed);
        res.status(204);
        return res.json({ success: true });
    }
    const flsp = yield Followship_1.Followship.create({
        followerId: (_h = req.user) === null || _h === void 0 ? void 0 : _h.id,
        followingId: +userId,
    }).save();
    if (!flsp) {
        res.status(404);
        throw new Error('팔로우 맺기에 실패했습니다.');
    }
    res.status(201);
    return res.json(flsp);
})));
exports.default = router;
//# sourceMappingURL=index.js.map