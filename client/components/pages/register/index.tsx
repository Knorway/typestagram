import { Box, Flex, Heading, Link, VStack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { object, string } from 'yup';
import { registerUser } from '../../../api/auth';
import { setTokenAndMutate } from '../../../lib/setTokenAndMutate';
import BaseButton from '../../common/buttons/BaseButton';
import FormikTextInput from '../../form/FormikTextInput';

function RegisterPage() {
	const [error, setError] = useState(null);
	const router = useRouter();

	return (
		<Formik
			initialValues={{
				email: '',
				username: '',
				password: '',
				confirmPassword: '',
			}}
			validationSchema={object({
				email: string()
					.email('올바른 이메일 형식이 아닙니다')
					.required('필수 항목입니다'),
				username: string().required('필수 항목입니다'),
				password: string().required('필수 항목입니다'),
				confirmPassword: string().test('passwords-match', function (value) {
					return this.parent.password !== value
						? this.createError({
								message: '비밀번호가 일치하지 않습니다',
								path: 'confirmPassword',
						  })
						: true;
				}),
			})}
			onSubmit={async (values) => {
				try {
					const response = await registerUser(values);
					setTokenAndMutate('user', response.data, '/auth/validate');
					router.push('/');
				} catch (error) {
					const message = error.response.data.message;
					setError(message);
				}
			}}
		>
			{({ errors }) => (
				<Flex
					width='100%'
					height='100vh'
					justifyContent='center'
					alignItems='center'
					direction='column'
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
							<Text color='gray.500' fontSize='15px' mb='0.75rem'>
								친구들의 사진과 동영상을 보려면
								<br /> 가입하세요.
							</Text>
							<Form>
								<FormikTextInput name='email' placeholder='이메일' />
								<FormikTextInput name='username' placeholder='유저이름' />
								<FormikTextInput
									name='password'
									type='password'
									placeholder='비밀번호'
								/>
								<FormikTextInput
									name='confirmPassword'
									type='password'
									placeholder='비밀번호 확인'
									mb='1rem'
								/>
								<BaseButton formError={errors} type='submit'>
									회원가입
								</BaseButton>
								{error && (
									<small style={{ color: 'tomato', display: 'block' }}>
										{error}
									</small>
								)}
							</Form>
						</Box>
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
						계정이 있으신가요?{' '}
						<Link as={NextLink} href='/login'>
							<Text
								display='inline-block'
								color='blue.600'
								ml='4px'
								cursor='pointer'
							>
								로그인
							</Text>
						</Link>
					</Flex>
				</Flex>
			)}
		</Formik>
	);
}

export default RegisterPage;
