import { setTimeout as asyncTimeout } from 'node:timers/promises';

export const delay = (milliseconds: number) => asyncTimeout(milliseconds, undefined as void, {ref: false});

export const getRandomInt = (minimum: number, maximum: number): number => {
	const min = Math.ceil(minimum);
	const max = Math.floor(maximum);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
