import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/layout';
import { setTokenAndMutate } from '../../lib/setTokenAndMutate';
import NextLink from 'next/link';
import useAuth from '../../hooks/useAuth';
import { Avatar } from '@chakra-ui/avatar';

function Header() {
	const { user } = useAuth();

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
				/>
				<HStack flex='1' justifyContent='flex-end'>
					<Box>
						<NextLink href='/register'>
							<a>회원가입</a>
						</NextLink>
					</Box>
					<Box>
						<NextLink href='/login'>
							<a>로그인</a>
						</NextLink>
					</Box>
					<Box
						cursor='pointer'
						onClick={() => {
							setTokenAndMutate('user', null, '/auth/validate');
						}}
					>
						로그아웃
					</Box>
					<Box>
						{user && (
							<NextLink href={`/account/${user.uuid}`}>
								<a>
									<Avatar size='xs' cursor='pointer' />
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
