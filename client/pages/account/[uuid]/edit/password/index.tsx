import { Box } from '@chakra-ui/layout';
import { Fade } from '@chakra-ui/transition';
import AccountDetailPassword from '../../../../../components/pages/account/edit/AccountDetailPassword';

function accountPasswordPage() {
	return (
		<Box w='100%'>
			<Fade in={true}>
				<AccountDetailPassword />
			</Fade>
		</Box>
	);
}

export default accountPasswordPage;
