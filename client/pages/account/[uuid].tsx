import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Box, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { IoMdSettings } from 'react-icons/io';
import useSWR from 'swr';
import client, { API_URL } from '../../api';
import useAuth from '../../hooks/useAuth';
import { BearerHeader } from '../../lib/bearerHeader';

const ProfilePage = () => {
	const router = useRouter();
	const { uuid } = router.query;

	const { user } = useAuth();
	const { data: profileUser } = useSWR(
		`${API_URL}/users/${uuid}`,
		async (url) => {
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

			const lastLine = result[result.length - 1];
			while (lastLine.length <= 2) {
				lastLine.push({ id: Date.now() + lastLine.length });
			}

			return result;
		}
	}, [profileUser]);

	console.log(user, 'user logged in');
	console.log(profileUser, 'profileUser');

	if (!profileUser || !user) return null;

	return (
		<VStack maxW='967px' w='100%' pt='2rem'>
			<HStack w='100%' mb='2rem'>
				<Box flex='1' display='flex' justifyContent='center' alignItems='center'>
					<Avatar size='2xl'></Avatar>
				</Box>
				<VStack flex='2' alignItems='flex-start'>
					<HStack>
						<Heading size='xl'>{profileUser.username}</Heading>
						<Button
							size='sm'
							backgroundColor='none'
							variant='outline'
							borderColor='gray.200'
						>
							프로필 편집
						</Button>
						<Box>
							<IoMdSettings fontSize='1.3rem' cursor='pointer' />
						</Box>
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
					<Box>자기 소개가 등록되지 않았습니다. 추가해보세요!</Box>
				</VStack>
			</HStack>
			<Divider />
			<VStack w='100%' p='2rem' pt='1rem'>
				<VStack spacing='8' w='100%'>
					{splicedPosts?.map((line, idx) => (
						<HStack key={idx} flexWrap='nowrap' w='100%'>
							{line.map((post) => (
								<HStack
									key={post.id}
									flex='1'
									h={['auto', 'auto', '300px']}
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

export default ProfilePage;
