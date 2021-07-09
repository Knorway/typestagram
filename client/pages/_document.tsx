import { ColorModeScript } from '@chakra-ui/color-mode';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import overrides from '../styles';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link
						href='https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'
						rel='stylesheet'
					/>
				</Head>
				<body>
					<ColorModeScript
						initialColorMode={overrides.config.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
