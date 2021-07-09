import Head from 'next/head';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import wrapper from '../store';
import { ChakraProvider } from '@chakra-ui/react';
import MainLayout from '../components/layouts/MainLayout';
import overrides from '../styles';
import { useRouter } from 'next/router';
import AccountEditLayout from '../components/layouts/AccountEditLayout';
import useSWR from 'swr';
import { useEffect } from 'react';
import { allowed, matchPathname } from '../lib/matchPathname';
import initializeAuth from '../fetcher/initializeAuth';

function Application({ Component, pageProps }: AppProps) {
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

	return (
		<ChakraProvider theme={overrides}>
			<Head>
				<title>Typestagram</title>
			</Head>
			<MainLayout>
				{router.pathname.startsWith('/account/[uuid]/edit') ? (
					// Account edit section specific layout
					<AccountEditLayout>
						<Component {...pageProps} />
					</AccountEditLayout>
				) : (
					// Global layout
					<Component {...pageProps} />
				)}
			</MainLayout>
		</ChakraProvider>
	);
}

export default wrapper.withRedux(Application);
