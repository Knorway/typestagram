import express from 'express';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { jwtAuth } from '../../middlewares/authMiddleware';

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
			callback(null, `post-image/${Date.now()}_${file.originalname}`);
		},
	}),
});

router.post(
	'/',
	jwtAuth,
	imgUpload.single('img'),
	asyncHandler(async (req: any, res) => {
		console.log(req.file);
		console.log(req.body);
		console.log(req.user);
		res.json(req.file.location);
	})
);

export default router;
