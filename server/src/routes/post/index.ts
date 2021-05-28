import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { imgUpload } from '../../config/multer';
import { Like } from '../../entity/junction/Like';
import { PostComment } from '../../entity/junction/PostComment';
import { Post } from '../../entity/Post';
import { jwtAuth } from '../../middlewares/authMiddleware';

dotenv.config();

const router = express.Router();

// [GET] /posts
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const { lastId } = req.query;

		try {
			const posts = await Post.createQueryBuilder('post')
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
				throw new Error('포스트를 불러오는 데 실패했습니다.');
			}

			res.json(posts);
		} catch (error) {
			console.log(error);
		}
	})
);

// it needs to be authtenticated to reach endpoints below
router.use(jwtAuth, (req, res, next) => next());

// [GET] /posts/search
router.get(
	'/search',
	asyncHandler(async (req, res) => {
		const { content } = req.query;
		const Posts = await Post.createQueryBuilder('post')
			.where('post.content LIKE :content', { content: `%${content}%` })
			.leftJoinAndSelect('post.comments', 'comments')
			.leftJoinAndSelect('post.likes', 'likes')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoinAndSelect('comments.user', 'commentor')
			.orderBy('post.updatedAt', 'DESC')
			.getMany();

		if (!Posts) {
			res.status(404);
			throw new Error('검색결과가 존재하지 않습니다.');
		}

		res.json(Posts);
	})
);

// [GET] /posts/search/instant
router.get(
	'/search/instant',
	asyncHandler(async (req, res) => {
		const { content } = req.query;

		const results = await Post.createQueryBuilder('post')
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
	})
);

// [GET] /posts/:postId
router.get(
	'/:postId',
	asyncHandler(async (req, res) => {
		const { postId } = req.params;
		const post = await Post.findOne({
			where: { uuid: postId },
			relations: ['user', 'comments', 'comments.user'],
		});

		if (!post) {
			res.status(404);
			throw new Error('존재하지 않는 포스트입니다.');
		}

		res.json(post);
	})
);

// [POST] /posts
router.post(
	'/',
	imgUpload.single('img'),
	asyncHandler(async (req: any, res) => {
		const post = await Post.create({
			content: req.body.description,
			img: req.file.location,
			user: req.user,
		}).save();

		if (!post) {
			res.status(404);
			throw new Error('포스트를 작성하는 데 실패했습니다.');
		}

		res.json(post);
	})
);

// [DELETE] /posts
router.delete(
	'/:postId',
	imgUpload.single('img'),
	asyncHandler(async (req: any, res) => {
		const post = await Post.findOne(req.params.postId);
		if (!post) {
			res.status(404);
			throw new Error('존재하지 않는 게시물입니다.');
		}

		await Post.remove(post);
		res.json({ success: true });
	})
);

// [PUT] /posts/:postId/edit
router.put(
	'/:postId/edit',
	imgUpload.single('img'),
	asyncHandler(async (req: any, res) => {
		const edited = await Post.update(req.params.postId, {
			content: req.body.description,
			img: req.file?.location ? req.file?.location : req.body.originalImg,
		});
		if (!edited) {
			res.status(400);
			throw new Error('포스트를 수정하는 데 실패했습니다.');
		}

		res.json(edited);
	})
);

// [PUT] /posts/:postId/likes
router.put(
	'/:postId/likes',
	asyncHandler(async (req, res) => {
		const liked = await Like.findOne({
			where: { postId: req.params.postId, userId: req.user?.id },
		});

		if (liked) {
			await Like.remove(liked);
			return res.json({ success: true });
		}

		await Like.create({ postId: +req.params.postId, userId: req.user?.id }).save();
		return res.json({ success: true });
	})
);

// [POST] /posts/:postId/comment
router.post(
	'/:postId/comment',
	asyncHandler(async (req, res) => {
		const newComment = await PostComment.create({
			comment: req.body.comment,
			postId: +req.params.postId,
			userId: req.user?.id,
		}).save();

		if (!newComment) {
			res.status(404);
			throw new Error('코멘트를 작성하는 데 실패했습니다.');
		}
		console.log(newComment);

		res.json(newComment);
	})
);

// [DELETE] /posts/:postId/comment
router.delete(
	'/:postId/comment/:commentId',
	asyncHandler(async (req, res) => {
		const deleted = await PostComment.findOne({
			where: { id: req.params.commentId },
		});
		if (!deleted) {
			res.status(400);
			throw new Error('코멘트를 삭제하는 데 실패했습니다.');
		}

		await PostComment.remove(deleted);
		res.json(deleted);
	})
);

router.get(
	'/test',
	asyncHandler(async (req, res) => {
		res.json({});
	})
);

export default router;
