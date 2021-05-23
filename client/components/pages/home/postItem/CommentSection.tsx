import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/layout';
import AddComment from './AddComment';
import { useState } from 'react';

function CommentSection({ post }) {
	const [comment, setComment] = useState('');

	return (
		<>
			<Box px='3' py='2' pt='0'>
				<Box>
					{/* MY COMMENT ON POST(DESCRIPTION) */}
					<Flex justifyContent='space-between'>
						<Text
							as='p'
							fontWeight='600'
							color='black'
							display='inline-block'
							pr='1'
							mb='1'
						>
							{post.user.username}{' '}
							<Text as='span' display='inline-block' fontWeight='normal'>
								{post.content}
							</Text>
						</Text>
						<Box>
							<Text
								display='inline-block'
								fontSize='11px'
								fontWeight='semibold'
								color='gray.500'
							>
								{format(new Date(post.createdAt), 'PPPP', {
									locale: ko,
								})}
							</Text>
						</Box>
					</Flex>
				</Box>

				{/* COMMENTS FROM OTHER USERS*/}
				<UnorderedList ml='0'>
					{post.comments?.map((comment, idx) => (
						<ListItem key={idx} listStyleType='none'>
							<Text display='inline' fontWeight='600'>
								{comment.user.username}
							</Text>
							<Text display='inline' pl='1' fontWeight='initial'>
								{comment.comment}
							</Text>
						</ListItem>
					))}
				</UnorderedList>

				{/* ADD COMMENTS */}
			</Box>
			<Box>
				<AddComment post={post} comment={comment} setComment={setComment} />
			</Box>
		</>
	);
}

export default CommentSection;
