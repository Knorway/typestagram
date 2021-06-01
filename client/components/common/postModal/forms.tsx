import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { RiSendPlaneFill } from 'react-icons/ri';

function PostSubmitButton({ as, ...props }: FieldConfig | InputProps | any) {
	const [field, meta, helper] = useField({
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
						console.log(meta.value);
						console.log(field.value);
					}}
					id='imgUploadButton'
				/>
			</FormControl>
		</>
	);
}

export { PostSubmitButton, PostImgButton };
