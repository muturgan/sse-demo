import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from './files.controller';
import { RenderController } from './sse/render.controller';
import { SseController } from './sse/sse.controller';
import { SseService } from './sse/sse.service';

@Module({
   imports: [
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'static'),
			serveRoot: '/static',
		})
   ],
	controllers: [FilesController, RenderController, SseController],
	providers: [SseService],
})
export class AppModule {}
