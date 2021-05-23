import { VStack } from '@chakra-ui/layout';
import AddPost from '../../common/postModal';
import PostList from './PostList';
import AddPostButton from './AddPostButton';
import { usePostModal } from '../../../hooks/usePostModal';

function HomePage() {
	const { toggled, toggleHandler } = usePostModal();

	return (
		<VStack
			as='section'
			maxWidth='935px'
			overflow='hidden'
			px='3'
			pt='1'
			flex={[1, 1, 'initial']}
		>
			<AddPostButton toggled={toggled} setToggled={toggleHandler} />
			<AddPost />
			<PostList />
		</VStack>
	);
}

export default HomePage;
