import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { PostHashtag } from './junction/PostHashtag';

@Entity()
export class Hashtag extends BaseModel {
	@Column()
	title: string;

	// [PoshHashtag]
	@OneToMany((type) => PostHashtag, (postHashtag) => postHashtag.hashtag)
	posts: PostHashtag[];
}
