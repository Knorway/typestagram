import { mutate } from 'swr';

export const setTokenAndMutate = (storage: string, token: string, key: string) => {
	localStorage.setItem(storage, JSON.stringify(token));
	mutate(key);
};
