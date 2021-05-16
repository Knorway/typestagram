import { Button, ButtonProps } from '@chakra-ui/button';
import { ReactNode } from 'react';

interface BaseButtonProps extends ButtonProps {
	children: ReactNode;
}

function BaseButton({ children, ...props }: BaseButtonProps) {
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
			{...props}
		>
			{children}
		</Button>
	);
}

export default BaseButton;
