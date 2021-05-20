import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from '../baseModel';
import { Post } from '../Post';
import { User } from '../User';

@Entity()
export class Like extends BaseModel {
	@PrimaryColumn()
	postId: number;
	@ManyToOne((type) => Post, (post) => post.likes)
	@JoinColumn({ name: 'postId' })
	post: Post;

	@PrimaryColumn()
	userId: number;
	@ManyToOne((type) => User, (user) => user.likedPosts)
	@JoinColumn({ name: 'userId' })
	user: User;
}
