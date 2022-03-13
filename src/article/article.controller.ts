import { 
	Controller, 
	Get, 
	Post, 
	Body, 
	Param, 
	Delete, 
	UseGuards, 
	UsePipes, 
	ValidationPipe, 
	Put 
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { ArticleResponseInterface } from '@app/interfaces/articleResponse.interface';
import { ArticleEntity } from '@app/article/entities/article.entity';


@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}


	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async createArticle(
		@User() currentUser: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto
	): Promise<ArticleResponseInterface> {
		const newArticle = await this.articleService.createArticle(currentUser, createArticleDto);

		return this.articleService.buildArticleResponse(newArticle);
	}


	@Get('all')
	async getAllArticles(): Promise<{ articles: ArticleEntity[] }> {
		const articles = await this.articleService.getAllArticles();
		return { articles };
	}


	@Get(':slug')
	async findArtucleBySlug(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findArtucleBySlug(slug);

		return this.articleService.buildArticleResponse(article);
	}


	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async updateArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string, 
		@Body('article') updateArticleDto: UpdateArticleDto
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateArticle(slug, currentUserId, updateArticleDto);

		return this.articleService.buildArticleResponse(article);
	}

	
	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}
}
