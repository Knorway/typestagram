import { Text, VStack } from '@chakra-ui/layout';
import { Fade } from '@chakra-ui/transition';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import client from '../../api';
import PostItem from '../../components/pages/home/postItem';
import { Post } from '../../components/pages/home/PostList';
import { BearerHeader } from '../../lib/bearerHeader';

function PostsPage() {
	const router = useRouter();
	const urlPath = router.asPath.split('?');

	const { data: posts, mutate: contextMutate } = useSWR(
		`${urlPath[0]}/search?${urlPath[1]}`,
		async (url) => {
			const response = await client.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	return (
		<Fade in={true}>
			<VStack>
				<Text
					fontSize='18px'
					fontWeight='500'
					fontStyle='italic'
					color='gray.700'
				>{`키워드 ${decodeURIComponent(
					urlPath[1].split('=')[1]
				)}에 대한 검색결과 입니다.`}</Text>
				{posts?.map((post: Post) => (
					<PostItem
						post={post}
						key={post.uuid}
						context='searchResults'
						contextMutate={contextMutate}
					/>
				))}
			</VStack>
		</Fade>
	);
}

export default PostsPage;
