import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseModel } from './baseModel';
import { Post } from './Post';

@Entity()
export class Hashtag extends BaseModel {
	@Column()
	title: string;

	@ManyToMany((type) => Post)
	@JoinTable()
	posts: Post[];
}
