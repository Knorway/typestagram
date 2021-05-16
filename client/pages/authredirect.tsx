import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setTokenAndMutate } from '../lib/setTokenAndMutate';
import useAuth from '../hooks/useAuth';

function AuthRedirect() {
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		const redirectWith = location.search.split('with=')[1];
		if (!redirectWith) router.back();
		if (redirectWith) setTokenAndMutate('user', redirectWith, '/auth/validate');
		if (user) router.push('/');
	}, [user]);

	return null;
}

export default AuthRedirect;
