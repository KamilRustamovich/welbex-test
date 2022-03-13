import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, OneToMany } from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/entities/article.entity';


@Entity({ name: 'users' })
@Unique('unique_user', ['username', 'email'])
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column({ select: false })
	password: string;

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 10)
	}

	@OneToMany(() => ArticleEntity, article => article.author)
	articles: ArticleEntity[];
}
