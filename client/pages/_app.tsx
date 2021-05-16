import Head from 'next/head';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import wrapper from '../store';
import { ChakraProvider } from '@chakra-ui/react';
import useCheckAuth from '../hooks/useCheckAuth';
import MainLayout from '../components/layouts/MainLayout';
import overrides from '../styles';

function Application({ Component, pageProps }: AppProps) {
	useCheckAuth();

	return (
		<ChakraProvider theme={overrides}>
			<Head>
				<title>Typestagram</title>
			</Head>
			<MainLayout>
				<Component {...pageProps} />
			</MainLayout>
		</ChakraProvider>
	);
}

export default wrapper.withRedux(Application);
