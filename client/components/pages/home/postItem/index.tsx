import { Box } from '@chakra-ui/layout';
import { Post } from '../PostList';
import CommentSection from './CommentSection';
import PostItemImage from './PostItemImage';
import UserInfo from './UserInfo';

interface PostItemProps {
	post: Post;
}

function PostItem({ post }: PostItemProps) {
	return (
		<Box
			as='article'
			display='block'
			width={['100%', '100%', '614px']}
			border='1px'
			borderColor='gray.300'
			borderRadius='3px'
			fontSize='14px'
		>
			<UserInfo post={post} />
			<PostItemImage post={post} />
			<CommentSection post={post} />
		</Box>
	);
}

export default PostItem;
