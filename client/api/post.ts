import client from '.';
import { BearerHeader } from '../lib/bearerHeader';

export const makeFollowship = (post: any) => async () =>
	await client.post(`/users/${post.user.id}/followship`, null, {
		headers: BearerHeader(),
	});

export const deletePost = (post: any) => async () =>
	await client.delete(`/posts/${post.id}`, {
		headers: BearerHeader(),
	});

export const createComment = (post: any, comment: any) => async () => {
	const response = await client.post(
		`/posts/${post.id}/comment`,
		{ comment },
		{ headers: BearerHeader() }
	);
	return response;
};
