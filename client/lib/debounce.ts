export const debounce = (callback: CallableFunction, delay: number) => {
	let timeout = null;

	return (...args: any) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
};
