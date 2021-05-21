import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Box, Divider, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
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
		`${API_URL}/auth/${uuid}`,
		async (url) => {
			const response = await client.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	console.log(profileUser);

	const splicePosts = useMemo(() => {
		if (profileUser && profileUser.posts) {
			const posts = profileUser.posts.slice();
			const result = [];
			while (posts.length) result.push(posts.splice(0, 3));
			return result;
		}
	}, [profileUser]);

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
						<Text fontWeight='semibold'>팔로워 0</Text>
						<Text fontWeight='semibold'>팔로우 0</Text>
					</HStack>
					<Box>자기 소개가 등록되지 않았습니다. 추가해보세요!</Box>
				</VStack>
			</HStack>
			<Divider />
			<VStack w='100%'>
				<VStack spacing='8' mt='2rem' w='100%'>
					{splicePosts.map((line, idx) => (
						<HStack key={idx} flexWrap='nowrap' w='100%'>
							{line.map((post) => (
								<HStack
									key={post.id}
									w='300px'
									h='300px'
									overflow='hidden'
								>
									<Image src={post.img} flex='1' />
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
