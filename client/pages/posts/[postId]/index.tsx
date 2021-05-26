import { VStack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import client from '../../../api';
import PostItem from '../../../components/pages/home/postItem';
import { BearerHeader } from '../../../lib/bearerHeader';

function PostById() {
	const router = useRouter();
	const postId = router.query.postId;

	const { data: post } = useSWR(
		`/posts/${postId}`,
		async (url) => {
			const response = await client.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	if (!post) return null;

	return (
		<VStack>
			<PostItem post={post} key={post.uuid} />
		</VStack>
	);
}

export default PostById;
