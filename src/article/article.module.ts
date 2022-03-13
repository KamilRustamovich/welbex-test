import { Module } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { ArticleController } from '@app/article/article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/entities/article.entity';


@Module({
	imports: [TypeOrmModule.forFeature([ArticleEntity])],
	controllers: [ArticleController],
	providers: [ArticleService]
})
export class ArticleModule {}
