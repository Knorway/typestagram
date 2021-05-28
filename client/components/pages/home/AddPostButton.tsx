import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SetStateAction } from 'react';
import { useAppSelector } from '../../../store';

interface AddButtonProps {
	toggled: boolean;
	setToggled: SetStateAction<any>;
}

const CreateButton = styled(Button)`
	transform: translate(-50%, 0);
	${(props) =>
		props.open &&
		css`
			transform: translate(-50%, 0) rotate(45deg);
			outline: none;
			&:hover {
				transform: translate(-50%, -13%) rotate(45deg);
			}
		`}
`;

function AddPostButton({ toggled, setToggled }: AddButtonProps) {
	const isLoading = useAppSelector((state) => state.postModal.isLoading);

	return (
		<CreateButton
			open={toggled}
			onClick={setToggled}
			position='fixed'
			top='94%'
			left='50%'
			cursor='pointer'
			fontSize='2rem'
			zIndex='19'
			bg='black'
			color='white'
			display='flex'
			justifyContent='center'
			alignItems='center'
			p='0'
			w='40px'
			h='40px'
			borderRadius='50%'
			_hover={{ bg: 'black', color: 'white', transform: 'translate(-50%, -13%)' }}
			disabled={isLoading}
			_disabled={{ background: 'gray.400' }}
		>
			{isLoading ? (
				<Spinner size='xs' />
			) : (
				<Text
					as='span'
					lineHeight='20px'
					fontSize='24px'
					fontWeight='700'
					pb='1'
					pl='1px'
				>
					+
				</Text>
			)}
		</CreateButton>
	);
}

export default AddPostButton;
