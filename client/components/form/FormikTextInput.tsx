import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';

function FormikTextInput({ as, ...props }: FieldConfig | InputProps) {
	const [field] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	return <div>{<Input size='sm' marginBottom='6px' {...props} {...field} />}</div>;
}

export default FormikTextInput;
