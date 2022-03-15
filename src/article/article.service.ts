import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import { FilesService } from '@app/files/files.service';


@Injectable()
export class ArticleService {
	private readonly _logger = new Logger(ArticleService.name);

	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepo: Repository<ArticleEntity>,

		private readonly filesSerivise: FilesService
	) {}


	async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto, file: Express.Multer.File): Promise<ArticleEntity> {
		try {
			const newArticle = await this.articleRepo.create(createArticleDto);
			if (file) {
				const newMedia = await this.filesSerivise.convertImage(file);
				const savedMedia = await this.filesSerivise.saveFiles(newMedia);

				newArticle.mediaURL = savedMedia.url;
				newArticle.mediaName = savedMedia.name;
			}

			newArticle.author = currentUser;
			newArticle.slug = this.getSlug(createArticleDto.title);

			return await this.articleRepo.save(newArticle);
		} catch (error) {
			this._logger.debug(error, 'createArticle method error');

			throw error;
		}
	}


	async getAllArticles(): Promise<ArticleEntity[]> {
		try {
			return await this.articleRepo.find();
		} catch (error) {
			this._logger.debug(error, 'getAllArticles method error');

			throw error;
		}
	}

	async findArtucleBySlug(slug: string): Promise<ArticleEntity> {
		try {
			const article = await this.articleRepo.findOne({ slug });

			if (!article) {
				throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
			}

			return article;
		} catch (error) {
			this._logger.debug(error, 'findOneBySlug method error');

			throw error;
		}
	}


	async updateArticle(slug: string, currentUserId: number, updateArticleDto: UpdateArticleDto) {
		try {
			const article = await this.findArtucleBySlug(slug);

			if (article.author.id !== currentUserId) {
				throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
			}

			Object.assign(article, updateArticleDto);
			article.slug = this.getSlug(updateArticleDto.title);

			return await this.articleRepo.save(article);
		} catch (error) {
			this._logger.debug(error, 'updateArticle method error');

			throw error;
		}
	}


	async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
		try {
			const article = await this.findArtucleBySlug(slug);

			if (article.author.id !== currentUserId) {
				throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
			}
		
			return await this.articleRepo.delete({ slug });
		} catch (error) {
			this._logger.debug(error, 'deleteArticle method error');

			throw error;
		}
	}


	private getSlug(title: string): string {
		return (
			slugify(title, {lower: true}) + 
			'-' + 
			((Math.random() * Math.pow(36, 6) | 0).toString(36))
		);
	}
}
