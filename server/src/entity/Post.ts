import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { PostHashtag } from './junction/PostHashtag';
import { User } from './User';
import { Like } from '../entity/junction/Like';
import { PostComment } from './junction/PostComment';

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
	@OneToMany((type) => PostHashtag, (postHashtag) => postHashtag.post, {
		cascade: true,
	})
	hashtags: PostHashtag[];

	// [PostComment]
	@OneToMany((type) => PostComment, (comment) => comment.post, { cascade: true })
	comments: PostComment[];

	// [Like]
	@OneToMany((type) => Like, (like) => like.post, { cascade: true })
	likes: Like[];
}
