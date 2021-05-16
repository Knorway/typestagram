import { Img } from '@chakra-ui/image';
import { Box, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
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

function PostItemImage({ post }) {
	const [isLiked, setIsLiked] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [likeOverlay, setLikeOverlay] = useState(false);

	const likeToggleHandler = () => {
		if (!isLiked) {
			setLikeOverlay(true);
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

	return (
		<>
			<Box position='relative'>
				<Img
					src={post.img}
					alt='post image'
					onLoad={setImgLoaded.bind(null, true)}
					onDoubleClick={likeToggleHandler}
				/>
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
				<LikeFollowSection isLiked={isLiked} setIsLiked={likeToggleHandler} />
			</Box>
		</>
	);
}

export default PostItemImage;
