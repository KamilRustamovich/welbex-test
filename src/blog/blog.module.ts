import { Module } from '@nestjs/common';
import { BlogService } from '@app/blog/blog.service';
import { BlogController } from '@app/blog/blog.controller';

@Module({
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
