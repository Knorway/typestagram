import { createConnection } from 'typeorm';

const typeormConfig = async () => {
	try {
		const conn = await createConnection({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: process.env.MYSQL_PASSWORD,
			database: 'typeorm_test',
			synchronize: true,
			logging: false,
			entities:
				process.env.NODE_ENV === 'production'
					? ['build/entity/**/*.js']
					: ['src/entity/**/*.ts'],
			migrations:
				process.env.NODE_ENV === 'production'
					? ['build/migration/**/*.js']
					: ['src/migration/**/*.ts'],
			subscribers:
				process.env.NODE_ENV === 'production'
					? ['build/subscriber/**/*.js']
					: ['src/subscriber/**/*.ts'],
			cli: {
				entitiesDir:
					process.env.NODE_ENV === 'production' ? 'build/entity' : 'src/entity',
				migrationsDir:
					process.env.NODE_ENV === 'production'
						? 'build/migration'
						: 'src/migration',
				subscribersDir:
					process.env.NODE_ENV === 'production'
						? 'build/subscriber'
						: 'src/subscriber',
			},
		});
		console.log('TypeORM connection to MySQL: ' + conn.isConnected);
	} catch (error) {
		console.error(error);
	}
};

export default typeormConfig;
