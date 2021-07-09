import { VStack } from '@chakra-ui/layout';
import { Fade } from '@chakra-ui/transition';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import client from '../../../api';
import PostItem from '../../../components/pages/home/postItem';
import { BearerHeader } from '../../../lib/bearerHeader';

function PostById() {
	const router = useRouter();
	const postId = router.query.postId;

	const {
		data: post,
		isValidating,
		mutate: contextMutate,
	} = useSWR(
		`/posts/${postId}`,
		async (url) => {
			if (!postId) return;
			const response = await client.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	useEffect(() => {
		if (!post && !isValidating) {
			router.push('/');
		}
	}, [post, isValidating]);

	if (!post) return null;

	return (
		<Fade in={true}>
			<VStack>
				<PostItem
					post={post}
					key={post.uuid}
					context='postById'
					contextMutate={contextMutate}
				/>
			</VStack>
		</Fade>
	);
}

export default PostById;
