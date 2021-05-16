import axios from 'axios';

const client = axios.create();

export const API_URL =
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_API_URL
		: 'http://localhost:4000';

client.defaults.baseURL = API_URL;

export default client;
