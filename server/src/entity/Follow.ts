import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './baseModel';
import { User } from './User';

@Entity()
export class Follow extends BaseModel {
	// @PrimaryColumn()
	// followerId: string;

	// @PrimaryColumn()
	// followingId: string;

	@ManyToOne((type) => User, (user) => user.followers, { primary: true })
	@JoinColumn({ name: 'followerId' })
	follower: User;

	@ManyToOne((type) => User, (user) => user.followings, { primary: true })
	@JoinColumn({ name: 'followingId' })
	following: User;
}
