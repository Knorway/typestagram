export const URL =
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_API_URL
		: 'http://localhost:4000';

export const CLIENT_URL =
	process.env.NODE_ENV === 'production'
		? process.env.CLIENT_URL
		: 'http://localhost:3000';
