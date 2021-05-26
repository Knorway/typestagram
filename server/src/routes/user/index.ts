import express from 'express';
import asyncHandler from 'express-async-handler';
import { Followship } from '../../entity/junction/Followship';
import { User } from '../../entity/User';
import { jwtAuth } from '../../middlewares/authMiddleware';
import bcrypt from 'bcryptjs';
import { imgUpload } from '../../config/multer';

const router = express.Router();

router.use(jwtAuth, (req, res, next) => next());

// [GET] /users/:userId
router.get(
	'/:userId',
	asyncHandler(async (req, res) => {
		const { userId: uuid } = req.params;
		const user = await User.createQueryBuilder('user')
			.where('user.uuid = :uuid', { uuid })
			.leftJoinAndSelect('user.posts', 'posts')
			.orderBy('posts.createdAt', 'DESC')
			.getOne();

		if (!user) {
			res.status(404);
			throw new Error('유저 어카운트 정보를 가져오는 데 실패했습니다.');
		}

		const followships = await Followship.createQueryBuilder('flsp')
			.where('flsp.follower = :id', { id: user.id })
			.orWhere('flsp.following = :id', { id: user.id })
			.select(['flsp.followerId', 'flsp.followingId', 'flsp.uuid'])
			.getMany();

		res.json({ ...user, followships });
	})
);

// [PUT] /users/:userId
router.put(
	'/:userId',
	imgUpload.single('avatarUrl'),
	asyncHandler(async (req: any, res) => {
		const nameExists = await User.findOne({ where: { username: req.body.username } });
		if (nameExists && nameExists.username !== req.user?.username) {
			res.status(400);
			throw new Error('이미 존재하는 유저명입니다.');
		}

		const edited = await User.update(req.user?.id!, {
			username: req.body.username,
			userInfo: req.body.userInfo,
			avatarUrl: req.file?.location ? req.file?.location : nameExists?.avatarUrl,
		});
		if (!edited) {
			res.status(400);
			throw new Error('유저정보를 수정하는 데 실패했습니다.');
		}
		res.json(edited);
	})
);

router.put(
	'/:userId/password',
	asyncHandler(async (req, res) => {
		const { password, newPassword, newPasswordConfirm } = req.body;
		if (newPassword !== newPasswordConfirm) {
			res.status(400);
			throw new Error('새로운 비밀번호가 일치하지 않습니다.');
		}

		const user = await User.findOne(req.user?.id, { select: ['password'] });
		const isPasswordMatch = await bcrypt.compare(password, user?.password!);

		if (!isPasswordMatch) {
			res.status(400);
			throw new Error('기존 비밀번호를 정확히게 입력해주세요.');
		}

		await User.update(user!, { password: await bcrypt.hash(newPassword, 12) });

		res.json({ success: true });
	})
);

// [POST] /users/:userId/followship
router.post(
	'/:userId/followship',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;

		if (req.user?.id === +userId) {
			res.status(400);
			throw new Error('자신은 팔로우 할 수 없습니다.');
		}

		const isFollowed = await Followship.findOne({
			where: { followerId: req.user?.id, followingId: userId },
		});

		if (isFollowed) {
			await Followship.remove(isFollowed);
			res.status(204);
			return res.json({ success: true });
		}

		const flsp = await Followship.create({
			followerId: req.user?.id,
			followingId: +userId,
		}).save();

		if (!flsp) {
			res.status(404);
			throw new Error('팔로우 맺기에 실패했습니다.');
		}

		res.status(201);
		return res.json(flsp);
	})
);

export default router;
