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
			entities: ['src/entity/**/*.ts'],
			migrations: ['src/migration/**/*.ts'],
			subscribers: ['src/subscriber/**/*.ts'],
			cli: {
				entitiesDir: 'src/entity',
				migrationsDir: 'src/migration',
				subscribersDir: 'src/subscriber',
			},
		});
		console.log('TypeORM connection to MySQL: ' + conn.isConnected);
	} catch (error) {
		console.error(error);
	}
};

export default typeormConfig;
