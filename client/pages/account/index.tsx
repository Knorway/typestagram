import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AccountPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.push('/');
	}, []);

	return null;
};

export default AccountPage;
