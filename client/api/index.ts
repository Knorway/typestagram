import axios from 'axios';

const client = axios.create();

export const API_URL =
	process.env.NODE_ENV === 'production'
		? 'https://api.typestagram.site'
		: 'https://api.typestagram.site';
// : 'http://localhost:4000';

client.defaults.baseURL = API_URL;
console.log(`------${client.defaults.baseURL}`);
console.log(`------${API_URL}`);

export default client;
