import { IS_DEBUG } from '../config';

export const printDebugMessage: (...args: Array<string>) => void = (
	...args: Array<string>
) => {
	if (IS_DEBUG) {
		print(...args);
	}
};
