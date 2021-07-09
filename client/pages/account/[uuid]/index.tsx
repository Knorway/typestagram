import { Fade } from '@chakra-ui/transition';
import Head from 'next/head';
import AccountDetail from '../../../components/pages/account/AccountDetail';
import useAuth from '../../../hooks/useAuth';

function accountDetailPage() {
	const { user } = useAuth();

	return (
		<>
			<Head>
				<title>{`${user.username} • typestagram`}</title>
			</Head>
			<Fade in={true}>
				<AccountDetail />
			</Fade>
		</>
	);
}

export default accountDetailPage;
