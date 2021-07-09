import { Box } from '@chakra-ui/layout';
import { Fade } from '@chakra-ui/transition';
import Head from 'next/head';
import AccountDetailProfile from '../../../../components/pages/account/edit/AccountDetailProfile';

function AccountEditPage() {
	return (
		<>
			<Head>
				<title>프로필 편집 • typestagram</title>
			</Head>
			<Box w='100%'>
				<Fade in={true}>
					<AccountDetailProfile />
				</Fade>
			</Box>
		</>
	);
}

export default AccountEditPage;
