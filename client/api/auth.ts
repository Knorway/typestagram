import client from '.';

export const registerUser = async (form: any) => {
	return await client.post('http://localhost:4000/auth/register', form);
};
export const loginUser = async (form: any) => {
	return await client.post('http://localhost:4000/auth/login', form);
};
