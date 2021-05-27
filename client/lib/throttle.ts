export const throttle = (callback: CallableFunction, delay: number) => {
	let intervalId = null;

	return (...args: any) => {
		if (intervalId) return;
		intervalId = setInterval(() => {
			callback(...args);
			clearInterval(intervalId);
			intervalId = null;
		}, delay);
	};
};
