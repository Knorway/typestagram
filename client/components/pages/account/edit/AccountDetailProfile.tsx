import { Avatar } from '@chakra-ui/avatar';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { ChangeEventHandler, useState } from 'react';
import client from '../../../../api';
import useAuth from '../../../../hooks/useAuth';
import { BearerHeader } from '../../../../lib/bearerHeader';
import BaseButton from '../../../common/buttons/BaseButton';
import EditPageFormikTextArea from '../../../form/EditPageFormikTextArea';
import EditPageFormikTextInput from '../../../form/EditPageFormikTextInput';

function AccountDetailProfile() {
	const { user } = useAuth();
	const router = useRouter();
	const [editError, setEditError] = useState(null);
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
	const [imgUrl, setImgUrl] = useState(null);

	const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			setAvatarUrl(reader.result);
		});
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
			setImgUrl(e.target.files[0]);
		}
	};

	return (
		<VStack p='1.5rem' w='100%'>
			<HStack w='100%' justifyContent='center' mb='2rem'>
				<Box>
					<Avatar size='lg' mr='1rem' src={avatarUrl} />
				</Box>
				<VStack>
					<Text fontSize='2xl' fontWeight='600'>
						{user.username}
					</Text>
					<FormControl>
						<FormLabel
							fontSize='13px'
							fontWeight='600'
							color='blue.400'
							htmlFor='edit-avatar'
							cursor='pointer'
							m='0'
						>
							프로필 사진 바꾸기
						</FormLabel>
						<Input
							id='edit-avatar'
							type='file'
							display='none'
							accept='image/*'
							onChange={handleAvatarChange}
						/>
					</FormControl>
				</VStack>
			</HStack>
			<Formik
				initialValues={{
					username: user.username,
					userInfo: user.userInfo ? user.userInfo : '',
				}}
				validationSchema={yup.object({
					username: yup.string().required('유저명은 공백일 수 없습니다.'),
				})}
				enableReinitialize={true}
				onSubmit={async (values) => {
					const form = new FormData();
					Object.entries(values).forEach((e) => form.append(e[0], e[1]));
					form.append('avatarUrl', imgUrl);
					try {
						await client.put(`/users/${user.id}`, form, {
							headers: BearerHeader(),
						});
						router.reload();
					} catch (error) {
						setEditError(error);
					}
				}}
			>
				{({ isValid, getFieldMeta, errors }) => (
					<VStack w='100%' as={Form} fontWeight='500'>
						<HStack w='85%'>
							<Flex flex='2' pl='2rem' w='100%' justifyContent='center'>
								<Text>유저명</Text>
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
							{!isValid && getFieldMeta('username').error}
						</Text>
						<Box alignSelf='flex-end' pr='3.1rem'>
							<BaseButton
								size='xs'
								w='75px'
								type='submit'
								formError={errors}
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

export default AccountDetailProfile;
