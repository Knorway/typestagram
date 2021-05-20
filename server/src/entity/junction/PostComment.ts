import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from '../baseModel';
import { Post } from '../Post';
import { User } from '../User';

@Entity()
export class PostComment extends BaseModel {
	@Column({ nullable: false })
	comment: string;

	@PrimaryColumn()
	userId: number;
	@ManyToOne((type) => User, (user) => user.comments)
	@JoinColumn({ name: 'userId' })
	user: User;

	@PrimaryColumn()
	postId: number;
	@ManyToOne((type) => Post, (post) => post.comments)
	@JoinColumn({ name: 'postId' })
	post: User;
}
