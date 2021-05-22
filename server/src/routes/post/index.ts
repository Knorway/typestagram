import express from 'express';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { jwtAuth } from '../../middlewares/authMiddleware';
import { Post } from '../../entity/Post';
import { Like } from '../../entity/junction/Like';
import { User } from '../../entity/User';
import { PostComment } from '../../entity/junction/PostComment';
import { getRepository } from 'typeorm';
import { Followship } from '../../entity/junction/Followship';

dotenv.config();

const router = express.Router();

AWS.config.update({
	accessKeyId: process.env.AWS_S3_ACCESS_KEY,
	secretAccessKey: process.env.AWS_S3_SECRET_KEY,
	region: 'ap-northeast-2',
});

const imgUpload = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'typestagram',
		key(req, file, callback) {
			callback(null, `${req.user?.uuid}/${Date.now()}_${file.originalname}`);
		},
	}),
});

// [GET] /posts
router.get(
	'/',
	asyncHandler(async (req, res) => {
		try {
			const posts = await Post.createQueryBuilder('post')
				.leftJoinAndSelect('post.comments', 'comments')
				.leftJoinAndSelect('post.likes', 'likes')
				.leftJoinAndSelect('post.user', 'user')
				.leftJoinAndSelect('comments.user', 'commentor')
				.orderBy('post.createdAt', 'DESC')
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

		res.json(newComment);
	})
);

router.get(
	'/test',
	asyncHandler(async (req, res) => {
		res.json({});
	})
);

export default router;
