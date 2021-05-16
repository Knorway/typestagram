import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Image } from '@chakra-ui/image';
import { Input, InputProps } from '@chakra-ui/input';
import { Box, Flex, VStack } from '@chakra-ui/layout';
import { FieldConfig, Form, Formik, useField } from 'formik';
import { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';
import client from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import AddPostButton from './AddPostButton';

function AddPost() {
	const [toggled, setToggled] = useState(false);
	const [imageRef, setImageRef] = useState<MutableRefObject<any>>(undefined);
	const imgRef = useRef();

	const togglehandler = () => setToggled((prev) => !prev);

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
	}, [toggled]);

	return (
		<Box>
			<AddPostButton toggled={toggled} setToggled={togglehandler} />
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
							initialValues={{ description: '', img: null }}
							onSubmit={async (values) => {
								const form = new FormData();
								Object.entries(values).forEach((e) =>
									form.append(e[0], e[1])
								);

								const response = await client.post('/posts', form, {
									headers: BearerHeader(),
								});
								console.log(response);
							}}
						>
							{() => (
								<Flex
									w='100%'
									borderTop='1px'
									borderTopColor='gray.300'
									alignItems='center'
									as={Form}
								>
									<PostSubmitButton type='submit' name='description' />
									<PostImgButton
										uploadHandler={uploadHandler}
										name='img'
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

function PostSubmitButton({ as, ...props }: FieldConfig | InputProps) {
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
