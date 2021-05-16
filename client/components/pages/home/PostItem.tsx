import { Avatar } from '@chakra-ui/avatar';
import { Input } from '@chakra-ui/input';
import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/layout';
import PostItemImage from './PostItemImage';
import { Post } from './PostList';

interface PostItemProps {
	post: Post;
}

function PostItem({ post }: PostItemProps) {
	return (
		<Box
			as='article'
			display='block'
			key={post.id}
			width={['100%', '100%', '614px']}
			justifySelf='stretch'
			border='1px'
			borderColor='gray.300'
			borderRadius='3px'
			fontSize='14px'
		>
			{/* userinfo */}
			<Flex padding='3'>
				<Avatar src='' size='xs' />
				<Flex justifyContent='space-between' width='100%'>
					<Text as='p' pl='3' pt='1px' fontWeight='600' color='black'>
						{post.creator}
					</Text>
					<Box>+</Box>
				</Flex>
			</Flex>

			{/* image section */}
			{/* + like and follow icons */}
			<PostItemImage post={post} />

			<Box px='3' py='2' pt='0'>
				<Box>
					<Text as='h3'>
						<Text
							as='p'
							fontWeight='600'
							color='black'
							display='inline-block'
							pr='1'
							mb='1'
						>
							{post.creator}
						</Text>
						{post.title}
					</Text>
				</Box>

				{/* comments sections */}
				<UnorderedList ml='0'>
					{post.comments.map((comment, idx) => (
						<ListItem key={idx} listStyleType='none'>
							<Text display='inline' fontWeight='600'>
								{comment.creator}
							</Text>
							<Text display='inline' pl='1' fontWeight='initial'>
								{comment.body}
							</Text>
						</ListItem>
					))}
				</UnorderedList>
			</Box>

			{/* add comments */}
			<Box borderTop='1px' borderColor='gray.300'>
				<Input
					placeholder='댓글 달기'
					border='none'
					_focus={{ outline: 'none' }}
					_placeholder={{
						fontSize: '13px',
						color: 'gray.500',
					}}
				/>
			</Box>
		</Box>
	);
}

export default PostItem;
