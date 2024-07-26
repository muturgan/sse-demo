import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from './files.controller.js';
import { RenderController } from './sse/render.controller.js';
import { SseController } from './sse/sse.controller.js';
import { SseService } from './sse/sse.service.js';

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
