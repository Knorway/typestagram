import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { Comment } from './Comment';
import { PostHashtag } from './junction/PostHashtag';
import { User } from './User';
import { Like } from '../entity/junction/Like';

@Entity()
export class Post extends BaseModel {
	@Column()
	content: string;

	@Column({ nullable: true })
	img: string;

	// [User]
	@ManyToOne((type) => User, (user) => user.posts)
	@JoinTable({ name: 'userId' })
	user: User;

	// [PoshHashtag]
	@OneToMany((type) => PostHashtag, (postHashtag) => postHashtag.post)
	hashtags: PostHashtag[];

	// [Comment]
	@OneToMany((type) => Comment, (comment) => comment.createdBy)
	comments: Comment[];

	// [Like]
	@OneToMany((type) => Like, (like) => like.post)
	likes: Like[];
}
