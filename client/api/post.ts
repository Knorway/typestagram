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
