export const delay = (milliseconds: number) => new Promise((r) => setTimeout(r, milliseconds));

export const getRandomInt = (minimum: number, maximum: number): number => {
	const min = Math.ceil(minimum);
	const max = Math.floor(maximum);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
