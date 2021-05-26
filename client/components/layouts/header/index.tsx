import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { setTokenAndMutate } from '../../../lib/setTokenAndMutate';
import NextLink from 'next/link';
import useAuth from '../../../hooks/useAuth';
import { Avatar } from '@chakra-ui/avatar';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { debounce } from '../../../lib/debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import client from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import { Image } from '@chakra-ui/image';
import { Spinner } from '@chakra-ui/spinner';

function Header() {
	const [instantData, setInstantData] = useState(null);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [mouseEnter, setMouseEnter] = useState(false);
	const router = useRouter();
	const { user } = useAuth();

	const instantSearch = useCallback(
		debounce(async (e: ChangeEvent<HTMLInputElement>) => {
			const { value: keyword } = e.target;
			setIsLoadingData(true);
			if (keyword) {
				const response = await client.get(
					`/posts/search/instant?content=${keyword}`,
					{ headers: BearerHeader() }
				);
				setInstantData(response.data);
				setIsLoadingData(false);
				console.log(response.data);
			}
			if (!keyword) {
				setInstantData(null);
			}
			setIsLoadingData(false);
		}, 300),
		[]
	);

	useEffect(() => {
		return () => {
			setInstantData(null);
		};
	}, [location.pathname]);

	console.log(mouseEnter, 'mouseEnter');

	return (
		<Flex
			width='100%'
			bg='white'
			justifyContent='center'
			borderBottom='1px'
			borderColor='gray.200'
			px='3'
		>
			<HStack as='header' width='100%' maxWidth='968px' height='3.3rem'>
				<Box flex='1'>
					<NextLink href='/'>
						<Heading
							fontFamily='Dancing Script, system-ui,sans-serif'
							fontWeight='700'
							size='lg'
							mb='8px'
							cursor='pointer'
							href='/'
							as='a'
						>
							Typestagram
						</Heading>
					</NextLink>
				</Box>

				<Box>
					<Box w='215px' position='relative'>
						<Input
							w='100%'
							size='sm'
							height='1.75rem'
							borderColor='gray.300'
							bg='#fafafa'
							position='relative'
							placeholder='검색'
							_placeholder={{ textAlign: 'center' }}
							onChange={(e) => {
								if (e.target.value) {
									instantSearch(e);
								}
							}}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									router.push(
										`/posts?content=${e.currentTarget.value}`
									);
									setInstantData(null);
								}
							}}
							onFocus={(e) => {
								if (e.target.value) {
									instantSearch(e);
								}
							}}
							onBlur={() => {
								if (!mouseEnter) {
									setInstantData(null);
								}
							}}
						/>
						{isLoadingData && (
							<Spinner
								size='xs'
								position='absolute'
								top='8px'
								right='8px'
								zIndex='20'
							/>
						)}
					</Box>
					{instantData && instantData.length !== 0 && (
						<VStack
							mt='0.5rem'
							position='absolute'
							width='215px'
							background='white'
							border='1px'
							borderColor='gray.200'
							borderRadius='4px'
							p='3px'
							overflow='hidden'
							alignItems='self-start'
							zIndex='19'
							onMouseEnter={() => setMouseEnter(true)}
							onMouseLeave={() => setMouseEnter(false)}
						>
							{instantData?.map((post) => (
								<Box
									key={post.uuid}
									display='flex'
									cursor='pointer'
									onClick={() => {
										router.push(`/posts/${post.uuid}`);
									}}
								>
									<Image src={post.img} w='40px' h='40px' />
									<Flex w='100%' alignItems='center' p='6px'>
										<Text fontSize='14px' fontWeight='600'>
											{post.user.username}
										</Text>
										<Box fontSize='12px' ml='5px' pt='4px'>
											{post.content.length > 8
												? post.content.slice(0, 8) + '...'
												: post.content}
										</Box>
									</Flex>
								</Box>
							))}
						</VStack>
					)}
				</Box>
				<HStack flex='1' justifyContent='flex-end'>
					<Box
						cursor='pointer'
						onClick={() => {
							setTokenAndMutate('user', null, '/auth/validate');
						}}
						mr='0.5rem'
					>
						<RiLogoutBoxRLine fontSize='1.5rem' color='#4A5568' />
					</Box>
					<Box>
						{user && (
							<NextLink href={`/account/${user.uuid}`}>
								<a>
									<Avatar
										size='xs'
										cursor='pointer'
										src={user.avatarUrl}
									/>
								</a>
							</NextLink>
						)}
					</Box>
				</HStack>
			</HStack>
		</Flex>
	);
}

export default Header;
