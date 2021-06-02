import Head from 'next/head';
import AccountDetailProfile from '../../../../components/pages/account/edit/AccountDetailProfile';

function AccountEditPage() {
	return (
		<>
			<Head>
				<title>프로필 편집 • typestagram</title>
			</Head>
			<AccountDetailProfile />;
		</>
	);
}

export default AccountEditPage;
