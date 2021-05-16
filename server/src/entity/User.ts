import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { Follow } from './Follow';
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

	@OneToMany((type) => Post, (post) => post.user)
	posts: Post[];

	@OneToMany((type) => Follow, (follow) => follow.follower)
	followers: Follow[];

	@OneToMany((type) => Follow, (follow) => follow.following)
	followings: Follow[];
}
