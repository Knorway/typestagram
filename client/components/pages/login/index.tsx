import { Box, Divider, Flex, Heading, HStack, Link, VStack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { object, string } from 'yup';
import client from '../../../api';
import { loginUser } from '../../../api/auth';
import { setTokenAndMutate } from '../../../lib/setTokenAndMutate';
import BaseButton from '../../common/buttons/BaseButton';
import SocialLoginButton from '../../common/buttons/SocialLoginButton';
import FormikTextInput from '../../form/FormikTextInput';

function LoginPage() {
	const [error, setError] = useState(null);
	const router = useRouter();

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			validationSchema={object({
				email: string()
					.email('올바른 이메일 형식이 아닙니다')
					.required('필수 항목입니다'),
				password: string().required('필수 항목입니다'),
			})}
			onSubmit={async (values) => {
				try {
					const response = await loginUser(values);
					setTokenAndMutate('user', response.data, '/auth/validate');
					router.push('/');
				} catch (error) {
					const message = error.response.data.message;
					setError(message);
				}
			}}
		>
			{() => (
				<VStack
					width='100%'
					height='100vh'
					justifyContent='center'
					alignItems='center'
				>
					<VStack
						direction='column'
						width='285px'
						px='2rem'
						py='1rem'
						border='1px'
						borderColor='gray.200'
						bg='white'
					>
						<Box>
							<Heading
								mb='1.5rem'
								fontFamily='Dancing Script, system-ui,sans-serif'
								fontWeight='700'
								size='2xl'
							>
								Typestagram
							</Heading>
							<Form>
								<FormikTextInput name='email' placeholder='이메일' />
								<FormikTextInput
									name='password'
									type='password'
									placeholder='비밀번호'
								/>
								<BaseButton type='submit'>로그인</BaseButton>
								{error && (
									<small style={{ color: 'tomato' }}>{error}</small>
								)}
							</Form>
						</Box>
						<VStack width='100%'>
							<Box fontSize='14px' fontWeight='500'>
								계정이 없으신가요?{' '}
								<NextLink href='/register'>
									<Link
										color='blue.600'
										_hover={{ textDecoration: 'none' }}
									>
										가입하기
									</Link>
								</NextLink>
							</Box>
							<HStack width='100%'>
								<Divider />
								<Box
									whiteSpace='nowrap'
									fontWeight='bold'
									fontSize='13px'
									color='gray.500'
									px='0.5rem'
								>
									또는
								</Box>
								<Divider />
							</HStack>
							<VStack width='100%' spacing='0'>
								<SocialLoginButton provider='google' />
								<SocialLoginButton provider='github' />
								<SocialLoginButton provider='naver' />
							</VStack>
						</VStack>
					</VStack>
					<Flex
						width='285px'
						border='1px'
						borderColor='gray.200'
						px='2rem'
						py='1rem'
						mt='1rem'
						fontSize='14px'
						justifyContent='center'
						bg='white'
					>
						데모 계정으로{' '}
						<Text
							color='blue.600'
							ml='4px'
							cursor='pointer'
							onClick={async () => {
								try {
									const response = await loginUser({
										email: 'demo@demo.com',
										password: '123123',
									});
									setTokenAndMutate(
										'user',
										response.data,
										'/auth/validate'
									);
									router.push('/');
								} catch (error) {
									const message = error.response.data.message;
									setError(message);
								}
							}}
						>
							로그인
						</Text>
						하기
					</Flex>
				</VStack>
			)}
		</Formik>
	);
}

export default LoginPage;
