import { UserEntity } from "@app/user/entities/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'articles' })
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createdAt: Date;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	updateddAt: Date;

	@Column()
	slug: string;

	@Column()
	title: string;

	@Column({ default: ''})
	text: string;

	@Column({ default: ''})
	mediaURL: string;

	@Column({ default: ''})
	mediaName: string;

	@BeforeUpdate()
	updateTimeStamp() {
		this.updateddAt = new Date();
	}

	@ManyToOne(
		() => UserEntity, 
		user => user.articles,
		{ eager: true }
	)
	author: UserEntity;
}
