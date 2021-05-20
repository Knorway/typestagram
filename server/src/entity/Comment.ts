import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './baseModel';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment extends BaseModel {
	@Column()
	comment: string;

	@ManyToOne((type) => Post, (post) => post.comments)
	@JoinColumn({ name: 'userId' })
	createdBy: User;
}
