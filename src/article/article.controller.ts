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
	Put, 
	UseInterceptors,
	UploadedFile
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}


	@Post('create')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	@UseInterceptors(FileInterceptor('files'))
	async createArticle(
		@User() currentUser: UserEntity,
		@Body() createArticleDto: CreateArticleDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<ArticleEntity> {
		return await this.articleService.createArticle(currentUser, createArticleDto, file);
	}


	@Get('all')
	async getAllArticles(): Promise<{ articles: ArticleEntity[] }> {
		const articles = await this.articleService.getAllArticles();
		return { articles };
	}


	@Get(':slug')
	async findArtucleBySlug(@Param('slug') slug: string): Promise<ArticleEntity> {
		return await this.articleService.findArtucleBySlug(slug);
	}


	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async updateArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string, 
		@Body() updateArticleDto: UpdateArticleDto
	): Promise<ArticleEntity> {
		return await this.articleService.updateArticle(slug, currentUserId, updateArticleDto);
	}

	
	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}
}
