import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import typeormConnection from './config/db';
import passport from 'passport';
import { passportStrategies } from './config/passport';

dotenv.config();

const server = () => {
	const PORT = process.env.PORT || 4000;
	try {
		typeormConnection();
		passportStrategies(passport);
		app.listen(PORT, () => console.log(`server running on port ${PORT}`));
	} catch (error) {
		console.error(error);
		process.exit(0);
	}
};

server();
