import { NextFunction, Request, Response } from 'express';

export const NotFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`존재하지 않는 경로입니다: ${req.originalUrl}`);
	res.status(404);
	next(error);
};

export const errorHander = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? null : error.stack,
	});
};
