import axios from 'axios';
import { memo, useCallback, useEffect, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import client, { API_URL } from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import { throttle } from '../../../lib/throttle';
import { useAppDispatch } from '../../../store';
import { postModalActions } from '../../../store/PostModal';
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

function PostList() {
	const dispatch = useAppDispatch();
	const { data: posts } = useSWR(
		`${API_URL}/posts`,
		async (url) => {
			const response = await axios.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	const shouldLoadMore = useMemo(() => !(posts?.length % 5), [posts]);
	const lastId = useMemo(
		() => posts?.length > 0 && posts[posts.length - 1].id,
		[posts]
	);

	const throttleScroll = useCallback(
		throttle(async () => {
			if (!shouldLoadMore) return;

			const { scrollTop, clientHeight, scrollHeight } = document.scrollingElement;
			if (scrollTop + clientHeight >= scrollHeight - 300) {
				dispatch(postModalActions.setLoading(true));
				const response = await client.get(`/posts?lastId=${lastId}`, {
					headers: BearerHeader(),
				});
				mutate(`${API_URL}/posts`, [...posts, ...response.data], false);
				setTimeout(() => {
					dispatch(postModalActions.setLoading(false));
				}, 300);
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
