import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { typeOrmConfig } from '@app/configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from '@app/article/article.module';
import { AuthMiddleware } from './middlewares/auth.middleware';


@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		ArticleModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL
		});
	}
}
