import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { User } from '../../entity/User';
import { generateToken } from '../../lib/token';
import { jwtAuth, passportAuth } from '../../middlewares/authMiddleware';

const router = express();

// [GET] /auth/register
router.post(
	'/register',
	asyncHandler(async (req, res) => {
		const { email, username, password } = req.body;

		if (await User.findOne({ where: { email } })) {
			res.status(400);
			throw new Error('이미 존재하는 계정입니다');
		}

		if (await User.findOne({ where: { username } })) {
			res.status(400);
			throw new Error('이미 존재하는 유저명입니다.');
		}

		const hash = await bcrypt.hash(password, 12);
		const user = await User.create({ email, username, password: hash }).save();
		const token = generateToken(user.uuid);

		res.json(token);
	})
);

// [POST] /auth/login
router.post(
	'/login',
	asyncHandler(async (req, res) => {
		const { email, password } = req.body;
		const user = await User.findOne({
			where: { email },
			select: ['email', 'username', 'password', 'uuid', 'provider'],
		});

		if (!user) {
			res.status(404);
			throw new Error('존재하지 않는 유저입니다');
		}

		if (user.provider !== 'local') {
			res.status(400);
			throw new Error(
				`해당 소셜 서비스로 가입되어 있는 계정입니다: ${user.provider}`
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401);
			throw new Error('올바르지 않은 비밀번호 입니다');
		}

		const token = generateToken(user.uuid);
		res.json(token);
	})
);

// [GET] /auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passportAuth('github'));
// [GET] /auth/google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passportAuth('google'));
// [GET] /auth/naver
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passportAuth('naver'));

// [GET] /auth/validate
router.get(
	'/validate',
	jwtAuth,
	asyncHandler(async (req, res) => {
		// const { id, email, username, uuid, provider } = req.user!;
		res.json(req.user);
	})
);

export default router;
