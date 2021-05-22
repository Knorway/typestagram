import { PassportStatic } from 'passport';
import dotenv from 'dotenv';
import {
	Strategy as jwtStrategy,
	ExtractJwt,
	StrategyOptions as jwtOptions,
	VerifyCallback as jwtVerify,
} from 'passport-jwt';
import {
	Strategy as githubStrategy,
	StrategyOptions as githubOptions,
} from 'passport-github2';
import {
	Strategy as googleStrategy,
	StrategyOptions as googleOptions,
} from 'passport-google-oauth20';
import { User } from '../entity/User';
import { Strategy as naverStategy, StrategyOption as naverOptions } from 'passport-naver';
import { Followship } from '../entity/junction/Followship';

dotenv.config();

type VerifyCallback = (
	accessToken: string,
	refreshToken: string,
	profile: any,
	done: any
) => void;

const jwtOptions: jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET!,
};
const githubOptions: githubOptions = {
	clientID: process.env.GITHUB_CLIENT!,
	clientSecret: process.env.GITHUB_SECRET!,
	callbackURL: 'http://localhost:4000/auth/github/callback',
};
const googleOptions: googleOptions = {
	clientID: process.env.GOOGLE_CLIENT!,
	clientSecret: process.env.GOOGLE_SECRET!,
	callbackURL: 'http://localhost:4000/auth/google/callback',
};
const naverOptions: naverOptions = {
	clientID: process.env.NAVER_CLIENT!,
	clientSecret: process.env.NAVER_SECRET!,
	callbackURL: 'http://localhost:4000/auth/naver/callback',
};

const handleOAuthUser = async (done: any, profile: any) => {
	try {
		const { email, providerId, username, provider } = profile;
		const exUser = await User.findOne({ where: { email } });
		console.log('query');

		if (exUser) {
			exUser.snsId = providerId;
			exUser.provider = provider;
			exUser.save();
			return done(null, exUser);
		}

		const user = await User.create({
			email,
			username: username || email,
			snsId: providerId,
			provider: provider,
		}).save();
		done(null, user);
	} catch (error) {
		done(error);
	}
};
const jwtVerify: jwtVerify = async (payload, done) => {
	try {
		const user = await User.createQueryBuilder('user')
			.where('user.uuid = :uuid', { uuid: payload.id })
			.getOne();

		if (!user) {
			throw new Error('존재하지 않는 계정입니다');
		}

		const followships = await Followship.createQueryBuilder('flsp')
			.where('flsp.follower = :id', { id: user.id })
			.orWhere('flsp.following = :id', { id: user.id })
			.select(['flsp.followerId', 'flsp.followingId', 'flsp.uuid'])
			.getMany();

		done(null, { ...user, followships });
	} catch (error) {
		console.log('jwt error');
		done(error);
	}
};
const githubVerify: VerifyCallback = async (_, __, profile, done) => {
	const { login: username, id: githubId, email, provider } = profile._json;

	handleOAuthUser(done, {
		email,
		username,
		provider: provider || 'github',
		providerId: githubId,
	});
};
const googleVerify: VerifyCallback = async (_, __, profile, done) => {
	const { displayName: username, id: googleId, provider } = profile;
	const { email } = profile._json;

	handleOAuthUser(done, {
		email,
		username,
		provider: provider || 'google',
		providerId: googleId,
	});
};
const naverVerify: VerifyCallback = async (_, __, profile, done) => {
	const { displayName: username, id: naverId, provider } = profile;
	const { email } = profile._json;

	handleOAuthUser(done, {
		email,
		username,
		provider: provider || 'naver',
		providerId: naverId,
	});
};

export const passportStrategies = (passport: PassportStatic) => {
	passport.initialize();
	passport.use(new jwtStrategy(jwtOptions, jwtVerify));
	passport.use(new githubStrategy(githubOptions, githubVerify));
	passport.use(new googleStrategy(googleOptions, googleVerify));
	passport.use(new naverStategy(naverOptions, naverVerify));
};
