import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from '../baseModel';
import { User } from '../User';

@Entity()
export class Followship extends BaseModel {
	@PrimaryColumn()
	followerId: number;
	@ManyToOne((type) => User, (user) => user.followers, {
		primary: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'followerId' })
	follower: User;

	@PrimaryColumn()
	followingId: number;
	@ManyToOne((type) => User, (user) => user.followings, {
		primary: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'followingId' })
	following: User;
}
