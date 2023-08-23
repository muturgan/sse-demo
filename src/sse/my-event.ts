export const enum MyEventType {
	HEARTBEAT = 'HEARTBEAT',
	RENDERED = 'RENDERED',
}

export interface IRenderedData {
	readonly userId: string,
	readonly requestId: string,
}

export class MyEvent<P = any> {
	constructor(
		public readonly type: MyEventType,
		public readonly payload?: P,
	) {}
}

export class HeartBeatEvent extends MyEvent {
	constructor() {
		super(MyEventType.HEARTBEAT);
	}
}

export class RenderedEvent extends MyEvent<IRenderedData> {
	constructor(payload: IRenderedData) {
		super(MyEventType.RENDERED, payload);
	}
}
