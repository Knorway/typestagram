import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseModel } from './baseModel';
import { Hashtag } from './hashtag';
import { User } from './User';

@Entity()
export class Post extends BaseModel {
	@Column()
	content: string;

	@Column({ nullable: true })
	img: string;

	@ManyToOne((type) => User, (user) => user.posts)
	@JoinTable({ name: 'userId' })
	user: User;

	// @ManyToMany((type) => Hashtag, (hashtag) => hashtag.posts)
	// @JoinTable()
	// hashtags: Hashtag[];
}
