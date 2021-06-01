import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { KeyboardEventHandler } from 'react';
import { createComment } from '../../../../api/post';
import useAuth from '../../../../hooks/useAuth';
import useFetch from '../../../../hooks/useFetch';

function AddComment({ post, comment, setComment }) {
	const { user } = useAuth();

	const { fetchData: fetchComment } = useFetch(createComment(post, comment));

	const handleAddComment: KeyboardEventHandler<HTMLInputElement> = async (e) => {
		if (e.key === 'Enter') {
			const response = await fetchComment();
			if (response) {
				post.comments.push({
					user: {
						id: user.id,
						username: user.username,
					},
					...response.data,
				});
				setComment('');
			}
		}
	};

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
