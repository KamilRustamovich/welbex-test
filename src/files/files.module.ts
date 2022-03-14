import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesService } from '@app/files/files.service';
import { path } from 'app-root-path';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${path}/uploads`,
	serveRoot: '/static'
  })],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
