import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../lib/token';

const CLIENT_URL = 'http://localhost:3000';
type role = 'public' | 'private' | 'me';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
	return passport.authenticate('jwt', { session: false }, (error, user) => {
		if (error) res.status(404);
		if (user) req.user = user;

		next(error && error);
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
