import client from '../api';

const initializeAuth = async (url: string) => {
	const token = JSON.parse(localStorage.getItem('user'));
	if (!token) return;

	const response = await client(url, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return response.data;
};

export default initializeAuth;
