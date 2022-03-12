import { Module } from '@nestjs/common';
import { BlogModule } from '@app/blog/blog.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [BlogModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
