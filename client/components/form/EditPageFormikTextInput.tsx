import { Input, InputProps } from '@chakra-ui/input';
import { FieldConfig, useField } from 'formik';

function EditPageFormikTextInput({ as, ...props }: FieldConfig | InputProps) {
	const [field] = useField({
		name: props.name,
		value: props.value,
		type: props.type,
		defaultValue: 'skdjfhskjdhfsd',
	});

	return (
		<div>
			{
				<Input
					size='md'
					marginBottom='6px'
					fontWeight='600'
					borderRadius='6px'
					{...props}
					{...field}
				/>
			}
		</div>
	);
}

export default EditPageFormikTextInput;
