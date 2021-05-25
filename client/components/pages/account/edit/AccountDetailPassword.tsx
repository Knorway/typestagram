import { Avatar } from '@chakra-ui/avatar';
import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../../../api';
import useAuth from '../../../../hooks/useAuth';
import { BearerHeader } from '../../../../lib/bearerHeader';
import BaseButton from '../../../common/buttons/BaseButton';
import EditPageFormikTextInput from '../../../form/EditPageFormikTextInput';

function AccountDetailPassword() {
	const [editError, setEditError] = useState(null);
	const router = useRouter();
	const { user } = useAuth();
	const isLocalUser = user.provider !== 'local';

	return (
		<VStack p='1.5rem' w='100%'>
			<HStack w='100%' justifyContent='center' mb='2rem'>
				<Box>
					<Avatar mr='1rem' />
				</Box>
				<Text>{user.username}</Text>
			</HStack>
			<Formik
				initialValues={{ password: '', newPassword: '', newPasswordConfirm: '' }}
				onSubmit={async (values) => {
					try {
						await client.put(`/users/${user.id}/password`, values, {
							headers: BearerHeader(),
						});
						router.reload();
					} catch (error) {
						setEditError(error);
					}
				}}
			>
				{() => (
					<VStack w='100%' as={Form} fontWeight='500'>
						<HStack w='85%'>
							<Box flex='2' pl='2rem' display='flex' w='100%'>
								<Text>비밀번호</Text>
							</Box>
							<Box flex='5' w='100%'>
								<EditPageFormikTextInput
									name='password'
									type='password'
									isDisabled={isLocalUser}
								/>
							</Box>
						</HStack>
						<HStack w='85%' data-test>
							<Box flex='2' pl='2rem'>
								<Text>새 비밀번호</Text>
							</Box>
							<Box flex='5' w='100%'>
								<EditPageFormikTextInput
									name='newPassword'
									type='password'
									isDisabled={isLocalUser}
								/>
							</Box>
						</HStack>
						<HStack w='85%'>
							<Box flex='2' pl='2rem'>
								<Text>새 비밀번호 확인</Text>
							</Box>
							<Box flex='5' w='100%'>
								<EditPageFormikTextInput
									name='newPasswordConfirm'
									type='password'
									isDisabled={isLocalUser}
								/>
							</Box>
						</HStack>
						{isLocalUser && (
							<Box fontSize='13px' fontStyle='italic'>
								<Text>비밀번호 설정이 필요하지 않습니다.</Text>
								<Text as='span'>
									<Text color='blue.400' display='inline-block'>
										{user.provider}
									</Text>
									(으)로 가입 된 계정입니다.
								</Text>
							</Box>
						)}
						{editError && (
							<Text color='tomato'>{editError.response.data.message}</Text>
						)}
						<Box alignSelf='flex-end' pr='3.1rem'>
							<BaseButton
								size='xs'
								w='75px'
								type='submit'
								isDisabled={isLocalUser}
							>
								제출
							</BaseButton>
						</Box>
					</VStack>
				)}
			</Formik>
		</VStack>
	);
}

export default AccountDetailPassword;
