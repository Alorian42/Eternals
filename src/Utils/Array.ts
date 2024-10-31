export function getRandomElement<T>(array: Array<T>): T {
	return array[Math.floor(array.length * Math.random())];
}
