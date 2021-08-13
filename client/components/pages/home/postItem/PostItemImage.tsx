import { Image } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import client from '../../../../api';
import useAuth from '../../../../hooks/useAuth';
import { BearerHeader } from '../../../../lib/bearerHeader';
import { swrStore } from '../../../../lib/swrStore';
import LikeFollowSection, { FilledLike } from './LikeFollowSection';

const LikeOverlay = styled(Box)`
	transition: all ease-in 0.1s;
	background-color: #000000;
	opacity: 0;
	${(props) =>
		props['data-liked'] &&
		css`
			opacity: 0.4;
		`};
`;

function PostItemImage({ post, context, contextMutate }) {
	const { user } = useAuth();

	const [isLiked, setIsLiked] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [likeOverlay, setLikeOverlay] = useState(false);

	const likeToggleHandler = async () => {
		if (!isLiked) {
			setLikeOverlay(true);
		}
		try {
			const setStore = swrStore(context, contextMutate);
			const response = await client.put(`/posts/${post.id}/likes`, null, {
				headers: BearerHeader(),
			});
			setStore(response);
		} catch (error) {
			console.log(error.response.data.message);
		}

		setIsLiked((prev) => !prev);
	};

	useEffect(() => {
		if (likeOverlay) {
			setTimeout(() => {
				setLikeOverlay(false);
			}, 800);
		}
	}, [likeOverlay]);

	useEffect(() => {
		setIsLiked(post.likes?.some((like) => like.userId === user.id));
	}, [post]);

	if (!post) return null;

	return (
		<>
			<Box position='relative'>
				<Flex justifyContent='center' maxH='600px'>
					<Image
						src={post.img}
						alt='post image'
						onLoad={() => setImgLoaded(true)}
						onDoubleClick={likeToggleHandler}
						w='100%'
						display={imgLoaded ? 'block' : 'none'}
					/>
					<Skeleton
						height={['300px', '500px']}
						width='100%'
						display={imgLoaded ? 'none' : 'block'}
					/>
				</Flex>
				<LikeOverlay
					data-liked={likeOverlay}
					onDoubleClick={likeToggleHandler}
					position='absolute'
					top='0'
					left='0'
					right='0'
					bottom='0'
					display='flex'
					flexDirection='column'
					justifyContent='center'
					alignItems='center'
				>
					<FilledLike cursur={false} />
					<Text color='transparent' ml='9999px'>
						prevent user select
					</Text>
				</LikeOverlay>
			</Box>
			<Box px='3' py='2' pb='0'>
				<LikeFollowSection
					isLiked={isLiked}
					setIsLiked={likeToggleHandler}
					likes={post.likes}
				/>
			</Box>
		</>
	);
}

export default PostItemImage;
