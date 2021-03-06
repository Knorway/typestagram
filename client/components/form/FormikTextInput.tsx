import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';

function FormikTextInput({ as, ...props }: FieldConfig | InputProps) {
	const [field, meta, helper] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	return (
		<div>
			{<Input size='sm' marginBottom='6px' {...props} {...field} />}
			{meta.touched && meta.error && (
				<small style={{ color: 'tomato' }}>{meta.error}</small>
			)}
		</div>
	);
}

export default FormikTextInput;
