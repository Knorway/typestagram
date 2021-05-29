import client from '.';
import { API_URL } from './index';

export const registerUser = async (form: any) => {
	return await client.post(`${API_URL}/auth/register`, form);
};
export const loginUser = async (form: any) => {
	return await client.post(`${API_URL}/auth/login`, form);
};
