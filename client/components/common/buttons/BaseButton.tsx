import { Button, ButtonProps } from '@chakra-ui/button';
import { ReactNode } from 'react';
import { isEmptyObject } from '../../../lib/utils';

interface BaseButtonProps extends ButtonProps {
	children: ReactNode;
	formError?: any;
}

function BaseButton({ children, formError = {}, ...props }: BaseButtonProps) {
	const isFormError = !isEmptyObject(formError);

	return (
		<Button
			type='submit'
			color='white'
			fontSize='14px'
			fontWeight='bold'
			bg='#1f89e0'
			height='2rem'
			borderRadius='3px'
			isFullWidth
			_hover={{
				background: isFormError ? 'gray.200' : '',
			}}
			{...props}
			disabled={isFormError}
		>
			{children}
		</Button>
	);
}

export default BaseButton;
