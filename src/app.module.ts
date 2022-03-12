import { Module } from '@nestjs/common';
import { BlogModule } from '@app/blog/blog.module';
import { UserModule } from '@app/user/user.module';
import { typeOrmConfig } from '@app/configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BlogModule, 
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
