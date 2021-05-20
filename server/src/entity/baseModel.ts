import {
	BaseEntity,
	BeforeInsert,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'uuid', unique: true })
	uuid: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	createUuid() {
		this.uuid = uuidv4();
	}
}
