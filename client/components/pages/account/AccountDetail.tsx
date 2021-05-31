import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Box, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { IoMdSettings } from 'react-icons/io';
import useSWR from 'swr';
import client, { API_URL } from '../../../api';
import useAuth from '../../../hooks/useAuth';
import { BearerHeader } from '../../../lib/bearerHeader';
import { nanoid } from '@reduxjs/toolkit';
import NextLink from 'next/link';

const AccountDetail = () => {
	const router = useRouter();
	const { uuid } = router.query;
	const { user } = useAuth();
	const { data: profileUser, error } = useSWR(
		`${API_URL}/users/${uuid}`,
		async (url) => {
			if (!uuid) return;
			const response = await client.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	const splicedPosts = useMemo(() => {
		if (profileUser && profileUser.posts.length !== 0) {
			const posts = profileUser.posts.slice();
			const result = [];

			while (posts.length) {
				result.push(posts.splice(0, 3));
			}

			// Creating dummy offsets for layout
			const lastLine = result[result.length - 1];
			while (lastLine.length < 3) {
				lastLine.push({ id: nanoid() });
			}

			return result;
		}
	}, [profileUser]);

	useEffect(() => {
		if (error) router.push('/');
	}, [error]);

	if (!profileUser) return null;

	return (
		<VStack maxW='967px' w='100%' p='2rem'>
			<HStack w='100%' mb='1rem'>
				<Box flex='1' display='flex' justifyContent='center' alignItems='center'>
					<Avatar size='2xl' src={profileUser.avatarUrl}></Avatar>
				</Box>
				<VStack flex='2' alignItems='flex-start'>
					<HStack justifyContent='space-between' w='100%'>
						<Heading size='xl'>{profileUser.username}</Heading>
						<HStack>
							<NextLink href={`/account/${user.uuid}/edit`}>
								<Button
									size='sm'
									backgroundColor='none'
									variant='outline'
									borderColor='gray.200'
								>
									프로필 편집
								</Button>
							</NextLink>
							<Box>
								<IoMdSettings fontSize='1.3rem' cursor='pointer' />
							</Box>
						</HStack>
					</HStack>
					<HStack py='0.8rem'>
						<Text fontWeight='semibold'>
							게시물{' '}
							{profileUser.posts.length === 0
								? 0
								: profileUser.posts.length}
						</Text>
						<Text fontWeight='semibold'>
							팔로우{' '}
							{
								profileUser.followships.filter(
									(flsp) => flsp.followerId === profileUser.id
								).length
							}
						</Text>
						<Text fontWeight='semibold'>
							팔로워{' '}
							{
								profileUser.followships.filter(
									(flsp) => flsp.followingId === profileUser.id
								).length
							}
						</Text>
					</HStack>
					<Box>
						{user.userInfo
							? user.userInfo
							: '자기 소개가 등록되지 않았습니다. 추가해보세요!'}
					</Box>
				</VStack>
			</HStack>
			<VStack w='100%' pt='1rem'>
				<Divider />
				<VStack spacing='6' w='100%'>
					{splicedPosts?.map((line, idx) => (
						<HStack
							key={idx}
							flexWrap='nowrap'
							w='100%'
							spacing='6'
							mt='2rem'
						>
							{line.map((post) => (
								<HStack
									key={post.id}
									flex='1'
									h={['auto', 'auto', '300px']}
									cursor='pointer'
									onClick={() => {
										router.push(`/posts/${post.uuid}`);
									}}
								>
									<Image
										src={post.img}
										objectFit='cover'
										height='100%'
									/>
								</HStack>
							))}
						</HStack>
					))}
				</VStack>
			</VStack>
		</VStack>
	);
};

export default AccountDetail;
