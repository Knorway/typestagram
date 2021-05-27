import axios from 'axios';
import { memo, UIEvent, useCallback, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import client, { API_URL } from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import { throttle } from '../../../lib/throttle';
import PostItem from './postItem';

export interface Post {
	id: number;
	uuid: string;
	content: string;
	img: string;
	comments: any;
	user: User;
	likes: any[];
	createdAt: string;
}
interface Comment {
	[key: string]: string;
}
interface User {
	[key: string]: string;
}

const LIMIT = 5;

function PostList() {
	const { data: posts } = useSWR(
		`${API_URL}/posts`,
		async (url) => {
			const response = await axios.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);
	const lastId = posts?.length > 0 && posts[posts.length - 1].id;

	const throttleScroll = useCallback(
		throttle(async () => {
			const { scrollTop, clientHeight, scrollHeight } = document.scrollingElement;
			if (scrollTop + clientHeight >= scrollHeight - 300) {
				const response = await client.get(
					`posts?lastId=${lastId}&limit=${LIMIT}`,
					{
						headers: BearerHeader(),
					}
				);
				mutate(`${API_URL}/posts`, [...posts, ...response.data], false);
				console.log(response.data, 'throttle');
			}
		}, 500),
		[posts]
	);

	useEffect(() => {
		document.addEventListener('scroll', throttleScroll);
		return () => document.removeEventListener('scroll', throttleScroll);
	}, [posts]);

	return (
		<>
			{posts?.map((post: Post) => (
				<PostItem post={post} key={post.uuid} />
			))}
		</>
	);
}

export default memo(PostList);
