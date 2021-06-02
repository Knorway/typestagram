import { Img } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useMemo, useState } from 'react';
import client from '../../../../api';
import LikeFollowSection, { FilledLike } from './LikeFollowSection';
import { BearerHeader } from '../../../../lib/bearerHeader';
import useAuth from '../../../../hooks/useAuth';
import { swrStore } from '../../../../lib/swrStore';

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

	const isLikedPost = useMemo(
		() => post?.likes?.some((like) => like.userId === user.id),
		[]
	);

	const [isLiked, setIsLiked] = useState(isLikedPost);
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

	if (!post) return null;

	return (
		<>
			<Box position='relative'>
				<Flex justifyContent='center' maxH='600px'>
					<Img
						src={post.img}
						alt='post image'
						onLoad={setImgLoaded.bind(null, true)}
						onDoubleClick={likeToggleHandler}
						w='100%'
					/>
				</Flex>
				{!imgLoaded && <Skeleton height={['300px', '600px']} width='100%' />}
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
