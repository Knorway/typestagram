import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';

function EditPageFormikTextInput({ as, ...props }: FieldConfig | InputProps) {
	const [field, meta] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	return (
		<div>
			<Input
				size='md'
				marginBottom='6px'
				fontWeight='600'
				borderRadius='6px'
				{...props}
				{...field}
			/>
			{meta.touched && meta.error && (
				<small style={{ color: 'tomato' }}>{meta.error}</small>
			)}
		</div>
	);
}

export default EditPageFormikTextInput;
