import { Avatar } from '@chakra-ui/avatar';
import { Input } from '@chakra-ui/input';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../../../api';
import useAuth from '../../../../hooks/useAuth';
import { BearerHeader } from '../../../../lib/bearerHeader';
import BaseButton from '../../../common/buttons/BaseButton';
import EditPageFormikTextArea from '../../../form/EditPageFormikTextArea';
import EditPageFormikTextInput from '../../../form/EditPageFormikTextInput';

function AccountDetailProfile() {
	const [editError, setEditError] = useState(null);
	const { user } = useAuth();
	const router = useRouter();

	return (
		<VStack p='1.5rem' w='100%'>
			<HStack w='100%' justifyContent='center' mb='2rem'>
				<Box>
					<Avatar mr='1rem' />
				</Box>
				<VStack>
					<Text>{user.username}</Text>
					<Text fontSize='13px' fontWeight='600' color='blue.400'>
						프로필 사진 바꾸기
					</Text>
				</VStack>
			</HStack>
			<Formik
				initialValues={{
					username: user.username,
					userInfo: user.userInfo ? user.userInfo : '',
				}}
				enableReinitialize={true}
				onSubmit={async (values) => {
					try {
						const response = await client.put(`/users/${user.id}`, values, {
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
							<Flex flex='2' pl='2rem' w='100%' justifyContent='center'>
								<Text>닉네임</Text>
							</Flex>
							<Box flex='5' w='100%'>
								<EditPageFormikTextInput name='username' />
							</Box>
						</HStack>
						<HStack w='85%'>
							<Flex flex='2' w='100%' pl='2rem' justifyContent='center'>
								<Text>소개</Text>
							</Flex>
							<Box flex='5' w='100%'>
								<EditPageFormikTextArea name='userInfo' />
							</Box>
						</HStack>
						<Text color='tomato'>
							{editError && editError.response.data.message}
						</Text>
						<Box alignSelf='flex-end' pr='3.1rem'>
							<BaseButton size='xs' w='75px' type='submit'>
								제출
							</BaseButton>
						</Box>
					</VStack>
				)}
			</Formik>
		</VStack>
	);
}

export default AccountDetailProfile;
