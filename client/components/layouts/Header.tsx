import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, HStack } from '@chakra-ui/layout';
import { setTokenAndMutate } from '../../lib/setTokenAndMutate';
import NextLink from 'next/link';
import useAuth from '../../hooks/useAuth';
import { Avatar } from '@chakra-ui/avatar';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

function Header() {
	const { user } = useAuth();
	const router = useRouter();

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

				<Input
					width='215px'
					size='sm'
					height='1.75rem'
					borderColor='gray.300'
					bg='#fafafa'
					placeholder='검색'
					_placeholder={{ textAlign: 'center' }}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							console.log(e.currentTarget.value);
							router.push(`/posts?content=${e.currentTarget.value}`);
						}
					}}
				/>
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
