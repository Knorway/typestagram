import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Image } from '@chakra-ui/image';
import { Input, InputProps } from '@chakra-ui/input';
import { Box, Flex, VStack } from '@chakra-ui/layout';
import { FieldConfig, Form, Formik, useField } from 'formik';
import { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';
import client, { API_URL } from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import { mutate } from 'swr';
import { useToast } from '@chakra-ui/toast';
import { usePostModal } from '../../../hooks/usePostModal';
import { useAppDispatch, useAppSelector } from '../../../store';

function AddPost() {
	const [imageRef, setImageRef] = useState<MutableRefObject<any>>(null);
	const { toggled, toggleHandler } = usePostModal();
	const imgRef = useRef();
	const toast = useToast();

	const editOn = useAppSelector((state) => state.postModal.editOn);
	const dispatch = useAppDispatch();

	console.log(editOn, 'editOn');

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
						<VStack w='100%'>
							<Box>
								<Image
									w='100%'
									maxHeight={['350px', '600px']}
									ref={imgRef}
									objectFit='cover'
								/>
							</Box>
						</VStack>
						<Formik
							initialValues={{
								description: editOn ? editOn.content : '',
								img: null,
							}}
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
								}
							}}
						>
							{({ values }) => {
								console.log(values);
								return (
									<Flex
										w='100%'
										borderTop='1px'
										borderTopColor='gray.300'
										alignItems='center'
										as={Form}
									>
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
								);
							}}
						</Formik>
					</VStack>
				</VStack>
			)}
		</Box>
	);
}

function PostSubmitButton({ as, ...props }: FieldConfig | InputProps | any) {
	const [field] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	return (
		<>
			<Input
				border='none'
				pt='2'
				placeholder='포스트는 반드시 사진과 글을 포함해야 합니다'
				_focus={{ outline: 'none' }}
				{...field}
				// onChange 커스텀
			/>
			<FormControl w='min-content' pt='2' cursor='pointer'>
				<FormLabel m='0' mr='8px' htmlFor='imgUploadSubmit'>
					<RiSendPlaneFill fontSize='1.8rem' cursor='pointer' />
				</FormLabel>
				<Button type='submit' display='none' id='imgUploadSubmit' />
			</FormControl>
		</>
	);
}

function PostImgButton({ as, ...props }: FieldConfig | InputProps | any) {
	const [field, meta, helpers] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	return (
		<>
			<FormControl w='min-content' pt='2' cursor='pointer'>
				<FormLabel m='0' mr='8px' htmlFor='imgUploadButton'>
					<HiOutlinePhotograph fontSize='1.8rem' cursor='pointer' />
				</FormLabel>
				<Input
					type='file'
					accept='image/*'
					display='none'
					onChange={(e) => {
						props.uploadHandler(e);
						helpers.setValue(e.target.files[0]);
					}}
					id='imgUploadButton'
				/>
			</FormControl>
		</>
	);
}

export default AddPost;
