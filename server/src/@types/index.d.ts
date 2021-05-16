import { User as UserModel } from '../entity/User';

declare global {
	namespace Express {
		export interface User extends UserModel {}
	}
}
