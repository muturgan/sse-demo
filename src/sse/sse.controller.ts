import { Controller, Get, Headers, Res, Sse } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { MyEvent } from './my-event.js';
import { SseService } from './sse.service.js';

@Controller('sse')
export class SseController {
	constructor(
		private readonly sseService: SseService,
	) {}

	@Sse('nest')
	public nest(@Headers() headers: Record<string, string>): Observable<MessageEvent<MyEvent>> {
		// к сожалению нативная браузерная реализация EventSource не позволяет передавать кастомные заголовки
		// так что для демонстрации давайте использовать user-agent в качестве userId
		// но существуют полифилы, которые позволяют передавать доп. заголовки, например https://github.com/Azure/fetch-event-source
		const userId = headers['user-agent'];
		return this.sseService.handleNestConnection(userId);
	}

	@Get('raw')
	public raw(
		@Res() res: FastifyReply, // ни что не мешает получить доступ к объекту запроса через fastify
		@Headers() headers: Record<string, string>,
	): void {
		const userId = headers['user-agent'];
		this.sseService.handleRawConnection(userId, res.raw);
	}
}
