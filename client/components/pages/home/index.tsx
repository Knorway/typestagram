import { VStack } from '@chakra-ui/layout';
import AddPost from './AddPost';
import PostList from './PostList';

function HomePage() {
	return (
		<VStack
			as='section'
			maxWidth='935px'
			overflow='hidden'
			px='3'
			pt='1'
			flex={[1, 1, 'initial']}
		>
			<AddPost />
			<PostList />
		</VStack>
	);
}

export default HomePage;
