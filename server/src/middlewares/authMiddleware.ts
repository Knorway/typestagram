import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../lib/token';
import { CLIENT_URL } from '../config/url';

type role = 'public' | 'private' | 'me';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
	return passport.authenticate('jwt', { session: false }, (error, user) => {
		const authError = error || !user;
		if (authError) res.status(401);
		if (user) req.user = user;

		next(authError && new Error('유저 인증 권한 획득에 실패했습니다.'));
	})(req, res, next);
};

export const passportAuth = (provider: string) => {
	return asyncHandler(async (req, res, next) => {
		passport.authenticate(provider, { session: false }, (error, user) => {
			if (error) {
				res.status(400);
				console.error(error);
				throw new Error(`${provider} oauth strategy callback error`);
			}
			const token = generateToken(user.uuid);

			res.redirect(CLIENT_URL + `/authredirect?with=${token}`);
		})(req, res, next);
	});
};
