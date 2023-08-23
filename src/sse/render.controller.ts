import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SseService } from './sse.service';

@Controller('api')
export class RenderController {
	constructor(
		private readonly sseService: SseService,
	) {}

	@Post('render')
	public startBunnerRendering(
		@Headers() headers: Record<string, string>,
		@Body() body: {requestId: string},
	): Promise<void> {
		// к сожалению нативная браузерная реализация EventSource не позволяет передавать кастомные заголовки
		// так что для демонстрации давайте использовать user-agent в качестве userId
		// но существуют полифилы, которые позволяют передавать доп. заголовки, например https://github.com/Azure/fetch-event-source
		const userId = headers['user-agent'];
		return this.sseService.startBunnerRendering(userId, body.requestId);
	}
}
