import Head from 'next/head';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import wrapper from '../store';
import { ChakraProvider } from '@chakra-ui/react';
import useCheckAuth from '../hooks/useCheckAuth';
import MainLayout from '../components/layouts/MainLayout';
import overrides from '../styles';
import { useRouter } from 'next/router';
import AccountEditLayout from '../components/layouts/AccountEditLayout';

function Application({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useCheckAuth();

	return (
		<ChakraProvider theme={overrides}>
			<Head>
				<title>Typestagram</title>
			</Head>
			<MainLayout>
				{router.pathname.startsWith('/account/[uuid]/edit') ? (
					<AccountEditLayout>
						<Component {...pageProps} />
					</AccountEditLayout>
				) : (
					// [Global Layout]
					<Component {...pageProps} />
				)}
			</MainLayout>
		</ChakraProvider>
	);
}

export default wrapper.withRedux(Application);
