import { extendTheme } from '@chakra-ui/react';

const overrides = extendTheme({
	styles: {
		global: (props) => ({
			body: {
				fontFamily: 'body',
				bg: '#fafafa',
				lineHeight: 'base',
				overflowY: 'scroll',
			},
		}),
	},
	config: {
		initialColorMode: 'light',
		useSystemColorMode: false,
	},
});

export default overrides;
