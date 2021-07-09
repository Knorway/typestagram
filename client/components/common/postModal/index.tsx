import { Image } from '@chakra-ui/image';
import { Box, Flex, Text, VStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';
import client, { API_URL } from '../../../api';
import { usePostModal } from '../../../hooks/usePostModal';
import { BearerHeader } from '../../../lib/bearerHeader';
import { useAppDispatch, useAppSelector } from '../../../store';
import { postModalActions } from '../../../store/PostModal';
import { PostImgButton, PostSubmitButton } from './forms';

function AddPost() {
	const [imageRef, setImageRef] = useState<MutableRefObject<any>>(null);
	const { toggled, toggleHandler } = usePostModal();
	const imgRef = useRef();
	const toast = useToast();

	const editOn = useAppSelector((state) => state.postModal.editOn);
	const dispatch = useAppDispatch();

	const uploadHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			imageRef.current.src = reader.result;
		});

		if (e.target.files[0]) {
			imageRef.current.style.display = 'block';
			reader.readAsDataURL(e.target.files[0]);
		} else {
			imageRef.current.style.display = 'none';
			imageRef.current.src = null;
		}
	};

	useEffect(() => {
		setImageRef(imgRef);
		if (editOn) {
			imageRef.current.src = editOn.img;
		}
	}, [toggled]);

	return (
		<Box>
			{toggled && (
				<VStack
					position='fixed'
					top='0'
					left='0'
					right='0'
					bottom='0'
					bg='rgba(0,0,0,0.6)'
					zIndex='18'
				>
					<VStack
						bg='#fafafa'
						pb='2'
						borderRadius='2px'
						w={['100%', '100%', '614px']}
						h='96%'
						justifyContent='space-between'
					>
						<Box w='100%'>
							<Image
								w='100%'
								h='100%'
								maxHeight={['350px', '600px']}
								ref={imgRef}
								objectFit='cover'
							/>
						</Box>
						<Formik
							initialValues={{
								description: editOn ? editOn.content : '',
								img: null,
							}}
							validationSchema={yup.object({
								description: yup
									.string()
									.required(
										'포스트는 글과 이미지를 반드시 포함해야 합니다'
									),
								img: yup
									.mixed()
									.required(
										'포스트는 글과 이미지를 반드시 포함해야 합니다'
									),
							})}
							onSubmit={async (values) => {
								const url = editOn
									? `/posts/${editOn.id}/edit`
									: `/posts`;
								const method = editOn ? 'put' : 'post';
								const form = new FormData();
								Object.entries(values).forEach((e) => {
									form.append(e[0], e[1]);
								});
								if (editOn) form.append('originalImg', editOn.img);

								try {
									dispatch(postModalActions.setLoading(true));
									await client[method](url, form, {
										headers: BearerHeader(),
									});
									mutate(`${API_URL}/posts`);
									toggleHandler();
									toast({
										title: '포스트가 등록되었습니다.',
										status: 'success',
										isClosable: true,
										duration: 2000,
									});
								} catch (error) {
									console.log(error.response.data.message);
								} finally {
									dispatch(postModalActions.setLoading(false));
									window.scrollTo(0, 0);
								}
							}}
						>
							{({ isValid, getFieldMeta }) => (
								<Flex
									w='100%'
									borderTop='1px'
									borderTopColor='gray.300'
									alignItems='center'
									position='relative'
									as={Form}
								>
									<Box position='absolute' left='33%' bottom='150%'>
										<small>
											{(!isValid && getFieldMeta('img').error) ||
												getFieldMeta('description').error}
										</small>
									</Box>
									<PostSubmitButton
										type='submit'
										name='description'
										editOn={editOn}
									/>
									<PostImgButton
										uploadHandler={uploadHandler}
										name='img'
										editOn={editOn}
									/>
								</Flex>
							)}
						</Formik>
					</VStack>
				</VStack>
			)}
		</Box>
	);
}

export default AddPost;
