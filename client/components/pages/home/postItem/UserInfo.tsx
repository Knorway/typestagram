import NextLink from 'next/link';
import { Avatar } from '@chakra-ui/avatar';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/menu';
import { FiMoreHorizontal } from 'react-icons/fi';
import { MouseEventHandler, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useToast } from '@chakra-ui/toast';
import { Button } from '@chakra-ui/button';
import { useAppDispatch } from '../../../../store';
import { postModalActions } from '../../../../store/PostModal';
import useFetch from '../../../../hooks/useFetch';
import useAuth from '../../../../hooks/useAuth';
import { deletePost, makeFollowship } from '../../../../api/post';
import { API_URL } from '../../../../api';
import { useRouter } from 'next/router';

function UserInfo({ post, context, contextMutate }) {
	const [isFollowing, setIsFollowing] = useState(false);

	const router = useRouter();
	const { user } = useAuth();
	const toast = useToast();

	const dispatch = useAppDispatch();
	const toggleHandler = () => {
		dispatch(postModalActions.editOn(post));
		dispatch(postModalActions.toggleModal());
	};

	const { fetchData: fetchFlsp } = useFetch(makeFollowship(post));
	const { fetchData: fetchDeletePost } = useFetch(deletePost(post));

	const deleteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		if (window.confirm('정말 포스트를 삭제하시겠습니까?')) {
			const response = await fetchDeletePost();
			if (response) {
				if (context === 'postById') return router.push('/');
				if (context === 'searchResults') return router.reload()
				mutate(`${API_URL}/posts`);
			}
		}
	};

	const toggleFollow = async () => {
		const response = await fetchFlsp();
		if (response) {
			switch (response.status) {
				case 201:
					user.followships.push(response.data);
					toast({
						title: `${post.user.username}님을 팔로우합니다.`,
						status: 'success',
						isClosable: true,
						duration: 2000,
					});
					break;
				case 204:
					user.followships = user.followships.filter(
						(flsp) => flsp.followingId !== post.user.id
					);
					toast({
						title: `이제 ${post.user.username}님을 팔로우 하지 않습니다.`,
						status: 'info',
						isClosable: true,
						duration: 2000,
					});
					break;
			}
			setIsFollowing((prev) => !prev);
		}
	};

	useEffect(() => {
		setIsFollowing(user.followships.some((flsp) => flsp.followerId === user.id));
	}, []);

	return (
		<Box>
			<Flex padding='3'>
				<Avatar src={post.user.avatarUrl} size='xs' />
				<Flex justifyContent='space-between' width='100%'>
					<Text as='p' pl='3' pt='1px' fontWeight='600' color='black'>
						<NextLink href={`/account/${post.user.uuid}`}>
							<a>{post.user.username}</a>
						</NextLink>
					</Text>
					<Menu>
						<Box>
							<MenuButton
								as={Button}
								fontSize='19px'
								cursor='pointer'
								height='1rem'
								padding='0'
								borderRadius='0'
								pb='2px'
								minW='16px'
								background='none'
								_active={{ background: 'none' }}
								_hover={{ background: 'none' }}
							>
								<FiMoreHorizontal />
							</MenuButton>
						</Box>
						{user.id === post.user.id ? (
							<MenuList>
								<MenuItem onClick={toggleHandler}>수정하기</MenuItem>
								<MenuDivider />
								<MenuItem color='tomato' onClick={deleteHandler}>
									삭제하기
								</MenuItem>
							</MenuList>
						) : (
							<MenuList>
								{isFollowing ? (
									<MenuItem color='tomato' onClick={toggleFollow}>
										팔로우 취소
									</MenuItem>
								) : (
									<MenuItem color='blue.600' onClick={toggleFollow}>
										팔로우 하기
									</MenuItem>
								)}
							</MenuList>
						)}
					</Menu>
				</Flex>
			</Flex>
		</Box>
	);
}

export default UserInfo;
