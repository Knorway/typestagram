export const CLIENT_URL =
	process.env.NODE_ENV === 'production'
		? process.env.CLIENT_URL
		: 'http://localhost:3000';
