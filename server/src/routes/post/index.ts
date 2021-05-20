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

dotenv.config();

const router = express.Router();

router.use(jwtAuth, (req, res, next) => next());

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
		const posts = await Post.createQueryBuilder('post')
			.select(['post', 'user.username', 'user.id', 'like.postId', 'like.userId'])
			.leftJoin('post.user', 'user')
			.leftJoin('post.likes', 'like')
			.orderBy('post.createdAt', 'DESC')
			.getMany();

		res.json(posts);
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

		res.json(post);
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

router.delete(
	'/:postId/likes',
	asyncHandler(async (req, res) => {
		const likedPost = await Like.findOne({
			where: { post: await Post.find({ where: { uuid: req.user?.uuid } }) },
		});

		res.json(likedPost);
	})
);

router.get(
	'/test',
	asyncHandler(async (req, res) => {
		const likes = await Like.find({ where: { userId: req.user?.id } });
		res.json(likes);
	})
);

export default router;
