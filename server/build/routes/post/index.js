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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_1 = require("../../config/multer");
const Like_1 = require("../../entity/junction/Like");
const PostComment_1 = require("../../entity/junction/PostComment");
const Post_1 = require("../../entity/Post");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
dotenv_1.default.config();
const router = express_1.default.Router();
// [GET] /posts
router.get('/', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lastId } = req.query;
    try {
        const posts = yield Post_1.Post.createQueryBuilder('post')
            .where(lastId ? 'post.id < :lastId' : '', { lastId })
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.likes', 'likes')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('comments.user', 'commentor')
            .orderBy('post.updatedAt', 'DESC')
            .take(5)
            .getMany();
        if (!posts) {
            res.status(404);
            throw new Error('???????????? ???????????? ??? ??????????????????.');
        }
        res.json(posts);
    }
    catch (error) {
        console.log(error);
    }
})));
// it needs to be authtenticated to reach endpoints below
router.use(authMiddleware_1.jwtAuth, (req, res, next) => next());
// [GET] /posts/search
router.get('/search', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.query;
    const Posts = yield Post_1.Post.createQueryBuilder('post')
        .where('post.content LIKE :content', { content: `%${content}%` })
        .leftJoinAndSelect('post.comments', 'comments')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('comments.user', 'commentor')
        .orderBy('post.updatedAt', 'DESC')
        .getMany();
    if (!Posts) {
        res.status(404);
        throw new Error('??????????????? ???????????? ????????????.');
    }
    res.json(Posts);
})));
// [GET] /posts/search/instant
router.get('/search/instant', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.query;
    const results = yield Post_1.Post.createQueryBuilder('post')
        .where('post.content LIKE :content', { content: `%${content}%` })
        .leftJoin('post.user', 'user')
        .select([
        'post.uuid',
        'post.content',
        'post.createdAt',
        'post.img',
        'user.username',
    ])
        .orderBy('post.createdAt', 'DESC')
        .getMany();
    res.json(results);
})));
// [GET] /posts/:postId
router.get('/:postId', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const post = yield Post_1.Post.findOne({
        where: { uuid: postId },
        relations: ['user', 'likes', 'comments', 'comments.user'],
    });
    if (!post) {
        res.status(404);
        throw new Error('???????????? ?????? ??????????????????.');
    }
    res.json(post);
})));
// [POST] /posts
router.post('/', multer_1.imgUpload.single('img'), express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.Post.create({
        content: req.body.description,
        img: req.file.location,
        user: req.user,
    }).save();
    if (!post) {
        res.status(404);
        throw new Error('???????????? ???????????? ??? ??????????????????.');
    }
    res.json(post);
})));
// [DELETE] /posts
router.delete('/:postId', multer_1.imgUpload.single('img'), express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.Post.findOne(req.params.postId);
    if (!post) {
        res.status(404);
        throw new Error('???????????? ?????? ??????????????????.');
    }
    yield Post_1.Post.remove(post);
    res.json({ success: true });
})));
// [PUT] /posts/:postId/edit
router.put('/:postId/edit', multer_1.imgUpload.single('img'), express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const edited = yield Post_1.Post.update(req.params.postId, {
        content: req.body.description,
        img: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.location) ? (_b = req.file) === null || _b === void 0 ? void 0 : _b.location : req.body.originalImg,
    });
    if (!edited) {
        res.status(400);
        throw new Error('???????????? ???????????? ??? ??????????????????.');
    }
    res.json(edited);
})));
// [PUT] /posts/:postId/likes
router.put('/:postId/likes', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const liked = yield Like_1.Like.findOne({
        where: { postId: req.params.postId, userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id },
    });
    if (liked) {
        yield Like_1.Like.remove(liked);
        const newPost = yield Post_1.Post.findOne(req.params.postId, {
            relations: ['user', 'likes', 'comments', 'comments.user'],
        });
        return res.json(newPost);
    }
    yield Like_1.Like.create({ postId: +req.params.postId, userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id }).save();
    const newPost = yield Post_1.Post.findOne(req.params.postId, {
        relations: ['user', 'likes', 'comments', 'comments.user'],
    });
    return res.json(newPost);
})));
// [POST] /posts/:postId/comment
router.post('/:postId/comment', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const newComment = yield PostComment_1.PostComment.create({
        comment: req.body.comment,
        postId: +req.params.postId,
        userId: (_e = req.user) === null || _e === void 0 ? void 0 : _e.id,
    }).save();
    if (!newComment) {
        res.status(404);
        throw new Error('???????????? ???????????? ??? ??????????????????.');
    }
    console.log(newComment);
    res.json(newComment);
})));
// [DELETE] /posts/:postId/comment
router.delete('/:postId/comment/:commentId', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield PostComment_1.PostComment.findOne({
        where: { id: req.params.commentId },
    });
    if (!deleted) {
        res.status(400);
        throw new Error('???????????? ???????????? ??? ??????????????????.');
    }
    yield PostComment_1.PostComment.remove(deleted);
    const post = yield Post_1.Post.findOne(req.params.postId, {
        relations: ['user', 'likes', 'comments', 'comments.user'],
    });
    res.json(post);
})));
router.get('/test', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({});
})));
exports.default = router;
//# sourceMappingURL=index.js.map