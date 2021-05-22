import express from 'express';
import asyncHandler from 'express-async-handler';
import { Followship } from '../../entity/junction/Followship';
import { User } from '../../entity/User';
import { jwtAuth } from '../../middlewares/authMiddleware';

const router = express.Router();

// [GET] /users/:userId
router.get(
	'/:userId',
	jwtAuth,
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

// [POST] /users/:userId/followship
router.post(
	'/:userId/followship',
	jwtAuth,
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
