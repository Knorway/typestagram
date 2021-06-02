import { AxiosResponse } from 'axios';

type swrStoreType = (context: string, mutate: any) => CallableFunction;

export const swrStore: swrStoreType = (context, mutate) => {
	switch (context) {
		case 'postList': {
			console.log('postlist');
			return (response: AxiosResponse) =>
				mutate((posts: any) => {
					return posts.map((post) =>
						post.id === response.data.id ? response.data : post
					);
				}, false);
		}
		case 'postById': {
			return (response: AxiosResponse) => mutate(() => response.data, false);
		}
		case 'searchResults': {
			return (response: AxiosResponse) =>
				mutate(
					(posts) =>
						posts.map((post) =>
							post.id === response.data.id ? response.data : post
						),
					false
				);
		}
		default:
			return;
	}
};
