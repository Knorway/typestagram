import { Textarea, TextareaProps } from '@chakra-ui/textarea';
import { FieldConfig, useField } from 'formik';

function EditPageFormikTextArea({ as, ...props }: FieldConfig | TextareaProps) {
	const [field] = useField({
		name: props.name,
		value: props.value,
		// type: props.type,
	});

	return (
		<div>
			{
				<Textarea
					size='sm'
					marginBottom='6px'
					fontWeight='600'
					borderRadius='5px'
					{...props}
					{...field}
				/>
			}
		</div>
	);
}

export default EditPageFormikTextArea;
