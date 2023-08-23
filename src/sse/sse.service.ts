import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { HeartBeatEvent, MyEvent, RenderedEvent } from './my-event';
import { ServerResponse } from 'http';
import { delay, getRandomInt } from '../utils';

// можно и на EventEmitter, но у нас же всё равно установлен rxjs
const eventSubject = new Subject<MyEvent>();
const event$ = eventSubject.asObservable();

setInterval(() => {
	// между микросервисом и браузером может быть куча прокси
	// чтобы они не обрубили соединение, будем периодически посылать пустые сообщения
	eventSubject.next(new HeartBeatEvent());
}, 5000);


@Injectable()
export class SseService {

	public handleNestConnection(userId: string): Observable<MessageEvent<MyEvent>> {
		return event$.pipe(
			filter((data) => {
				const eventUserId = data.payload?.userId;
				// сообщения могут быть как общими - сегодня вечером на сервере профилактика
				// так и адресные - ваша заявка обработана
				return !eventUserId || eventUserId === userId;
			}),
			map((data) => ({ data } as MessageEvent)),
		);
	}

	public handleRawConnection(userId: string, rawRes: ServerResponse): Observable<void> {
		rawRes.writeHead(200, {
			'Content-Type': 'text/event-stream; charset=utf-8',
			'Connection': 'keep-alive',
			'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
			'Pragma': 'no-cache',
			'Expire': '0',
			'X-Accel-Buffering': 'no',
		});

		let eventId = 0;

		return event$.pipe(
			filter((data) => {
				const eventUserId = data.payload?.userId;
				return !eventUserId || eventUserId === userId;
			}),
			map((data) => {
				rawRes.write(`event: message\n`);
				rawRes.write(`data: ${JSON.stringify(data)}\n`);
            rawRes.write(`id: ${++eventId} \n`);
            rawRes.write("\n");
			}),
		);
	}

	public async startBunnerRendering(userId: string, requestId: string): Promise<void> {
		const timeout = getRandomInt(500, 2000);
		await delay(timeout);
		this.renderBunnerInBackground(userId, requestId);
	}

	private renderBunnerInBackground(userId: string, requestId: string): void {
		const timeout = getRandomInt(2000, 8000);
		delay(timeout).then(() => {
			eventSubject.next(new RenderedEvent({ userId, requestId }));
		});
	}
}