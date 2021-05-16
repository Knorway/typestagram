import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import initializeAuth from '../fetcher/initializeAuth';
import { matchPathname } from '../lib/matchPathname';

export const allowed = ['/register', '/authredirect'];

const useCheckAuth = () => {
	const router = useRouter();
	const { data: user, isValidating } = useSWR('/auth/validate', initializeAuth, {
		revalidateOnFocus: false,
	});

	if (typeof window !== 'undefined') {
		useEffect(() => {
			if (!user && !isValidating) {
				if (!matchPathname(allowed)) {
					router.push('/login');
				}
			}
		}, [location.pathname, user, isValidating]);
	}
};

export default useCheckAuth;
