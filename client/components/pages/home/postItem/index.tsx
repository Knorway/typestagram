import { Box } from '@chakra-ui/layout';
import { memo } from 'react';
import { Mutator } from 'swr/dist/types';
import { Post } from '../PostList';
import CommentSection from './CommentSection';
import PostItemImage from './PostItemImage';
import UserInfo from './UserInfo';

interface PostItemProps {
	post: Post;
	context: string;
	contextMutate: Mutator;
}

function PostItem({ post, context, contextMutate }: PostItemProps) {
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
			<UserInfo post={post} context={context} contextMutate={contextMutate} />
			<PostItemImage post={post} context={context} contextMutate={contextMutate} />
			<CommentSection post={post} context={context} contextMutate={contextMutate} />
		</Box>
	);
}

export default memo(PostItem);
