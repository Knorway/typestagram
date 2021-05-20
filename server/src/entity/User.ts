import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { Followship } from './junction/Followship';
import { Like } from './junction/Like';
import { Post } from './Post';

@Entity()
export class User extends BaseModel {
	@Column({ unique: true })
	email: string;

	@Column()
	username: string;

	@Column({ nullable: true, select: false })
	password: string;

	@Column({ nullable: true })
	snsId: string;

	@Column({ default: 'local' })
	provider: string;

	// [Post]
	@OneToMany((type) => Post, (post) => post.user)
	posts: Post[];

	// [Followship]
	@OneToMany((type) => Followship, (followship) => followship.follower)
	followers: Followship[];

	@OneToMany((type) => Followship, (followship) => followship.following)
	followings: Followship[];

	// [Like]
	@OneToMany((type) => Like, (like) => like.user)
	likedPosts: Like[];
}
