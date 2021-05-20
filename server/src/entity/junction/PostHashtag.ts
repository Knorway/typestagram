import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../baseModel';
import { Hashtag } from '../hashtag';
import { Post } from '../Post';

@Entity()
export class PostHashtag extends BaseModel {
	@ManyToOne((type) => Post, (post) => post.hashtags, {
		primary: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'postId' })
	post: Post;

	@ManyToOne((type) => Hashtag, (hashtag) => hashtag.posts, {
		primary: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'hashtagId' })
	hashtag: Post;
}
