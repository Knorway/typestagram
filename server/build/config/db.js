"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeormConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield typeorm_1.createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: process.env.MYSQL_PASSWORD,
            database: 'typeorm_test',
            synchronize: true,
            logging: false,
            entities: process.env.NODE_ENV === 'production'
                ? ['build/entity/**/*.js']
                : ['src/entity/**/*.ts'],
            migrations: process.env.NODE_ENV === 'production'
                ? ['build/migration/**/*.js']
                : ['src/migration/**/*.ts'],
            subscribers: process.env.NODE_ENV === 'production'
                ? ['build/subscriber/**/*.js']
                : ['src/subscriber/**/*.ts'],
            cli: {
                entitiesDir: process.env.NODE_ENV === 'production' ? 'build/entity' : 'src/entity',
                migrationsDir: process.env.NODE_ENV === 'production'
                    ? 'build/migration'
                    : 'src/migration',
                subscribersDir: process.env.NODE_ENV === 'production'
                    ? 'build/subscriber'
                    : 'src/subscriber',
            },
        });
        console.log('TypeORM connection to MySQL: ' + conn.isConnected);
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = typeormConfig;
//# sourceMappingURL=db.js.map