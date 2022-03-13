import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsString()
	readonly text: string;

	@IsString()
	readonly image: string;

	@IsString()
	readonly video: string;
}
