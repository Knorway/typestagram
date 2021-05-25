import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Box, Flex, HStack, ListItem, Text, UnorderedList } from '@chakra-ui/layout';
import AddComment from './AddComment';
import { useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import useAuth from '../../../../hooks/useAuth';
import client, { API_URL } from '../../../../api';
import { BearerHeader } from '../../../../lib/bearerHeader';
import { mutate } from 'swr';

function CommentSection({ post }) {
	const [comment, setComment] = useState('');
	const { user } = useAuth();

	console.log(post.comments);
	console.log(user.id);

	const handleDeleteComment = async (commentId) => {
		if (window.confirm('정말로 코멘트를 삭제하시겠습니까?')) {
			try {
				await client.delete(`${API_URL}/posts/${post.id}/comment/${commentId}`, {
					headers: BearerHeader(),
				});

				mutate(`${API_URL}/posts`);
			} catch (error) {
				console.log(error.response.data.message);
			}
		}
	};

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
							maxW='80%'
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
						<HStack key={idx} justifyContent='space-bewteen'>
							<Box w='100%'>
								<ListItem listStyleType='none'>
									<Text display='inline' fontWeight='600'>
										{comment.user.username}
									</Text>
									<Text display='inline' pl='1' fontWeight='initial'>
										{comment.comment}
									</Text>
								</ListItem>
							</Box>
							<Box>
								<Text>
									{comment.user.id === user.id && (
										<TiDelete
											cursor='pointer'
											onClick={() =>
												handleDeleteComment(comment.id)
											}
										/>
									)}
								</Text>
							</Box>
						</HStack>
					))}
				</UnorderedList>
			</Box>

			{/* ADD COMMENTS */}
			<Box>
				<AddComment post={post} comment={comment} setComment={setComment} />
			</Box>
		</>
	);
}

export default CommentSection;
