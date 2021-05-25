import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { KeyboardEventHandler } from 'react';
import client, { API_URL } from '../../../../api';
import useAuth from '../../../../hooks/useAuth';
import useFetch from '../../../../hooks/useFetch';
import { BearerHeader } from '../../../../lib/bearerHeader';

function AddComment({ post, comment, setComment }) {
	const { user } = useAuth();

	const handleAddComment: KeyboardEventHandler<HTMLInputElement> = async (e) => {
		if (e.key === 'Enter') {
			const response = await fetchComment();
			post.comments.unshift({
				user: {
					id: user.id,
					username: user.username,
				},
				...response.data,
			});
			setComment('');
		}
	};

	const { fetchData: fetchComment } = useFetch(async () => {
		const response = await client.post(
			`${API_URL}/posts/${post.id}/comment`,
			{ comment },
			{ headers: BearerHeader() }
		);
		return response;
	});

	return (
		<Box borderTop='1px' borderColor='gray.300'>
			<Input
				placeholder='댓글 달기'
				border='none'
				_focus={{ outline: 'none' }}
				_placeholder={{
					fontSize: '13px',
					color: 'gray.500',
				}}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				onKeyPress={handleAddComment}
			/>
		</Box>
	);
}

export default AddComment;
