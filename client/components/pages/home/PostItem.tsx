import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/menu';
import { useToast } from '@chakra-ui/toast';
import NextLink from 'next/link';
import { KeyboardEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { mutate } from 'swr';
import client, { API_URL } from '../../../api';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import { BearerHeader } from '../../../lib/bearerHeader';
import PostItemImage from './PostItemImage';
import { Post } from './PostList';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAppDispatch } from '../../../store';
import { postModalActions } from '../../../store/PostModal';

interface PostItemProps {
	post: Post;
}

function PostItem({ post }: PostItemProps) {
	const [comment, setComment] = useState('');
	const [isFollowing, setIsFollowing] = useState(false);

	const dispatch = useAppDispatch();
	const toggleHandler = () => dispatch(postModalActions.toggleModal());

	const toast = useToast();

	const { user } = useAuth();
	const { fetchData: fetchComment } = useFetch(async () => {
		const response = await client.post(
			`${API_URL}/posts/${post.id}/comment`,
			{ comment },
			{ headers: BearerHeader() }
		);
		return response;
	});
	const { fetchData: fetchFlsp } = useFetch(async () => {
		const response = await client.post(
			`${API_URL}/users/${post.user.id}/followship`,
			null,
			{ headers: BearerHeader() }
		);
		return response;
	});

	const handleAddComment: KeyboardEventHandler<HTMLInputElement> = async (e) => {
		if (e.key === 'Enter') {
			await fetchComment();
			post.comments.unshift({
				user: { username: user.username },
				comment,
			});
			setComment('');
		}
	};

	const deleteHandler: MouseEventHandler<HTMLButtonElement> = async () => {
		if (window.confirm('정말 포스트를 삭제하시겠습니까?')) {
			try {
				await client.delete(`${API_URL}/posts/${post.id}`, {
					headers: BearerHeader(),
				});
				mutate(`${API_URL}/posts`);
			} catch (error) {
				console.log(error.response.data.message);
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
		<Box
			as='article'
			display='block'
			width={['100%', '100%', '614px']}
			justifySelf='stretch'
			border='1px'
			borderColor='gray.300'
			borderRadius='3px'
			fontSize='14px'
		>
			{/* USERINFO */}
			<Flex padding='3'>
				<Avatar src='' size='xs' />
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

			{/* IMAGE SECTION + LIKE AND FOLLOW ICONS */}
			<PostItemImage post={post} />

			<Box px='3' py='2' pt='0'>
				<Box>
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

				{/* COMMENTS SECTIONS */}
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
			</Box>

			{/* ADD COMMENTS */}
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
		</Box>
	);
}

export default PostItem;
