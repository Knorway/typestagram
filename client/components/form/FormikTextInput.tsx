import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';

function FormikTextInput({ as, ...props }: FieldConfig | InputProps) {
	const [field, meta, helper] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
	});

	// const handleChange = (e) => {
	// 	switch (field.name) {
	// 		case 'username': {
	// 			console.log('username');
	// 			return;
	// 		}
	// 		default: {
	// 			helper.setValue(e.target.value);
	// 		}
	// 	}
	// };

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
