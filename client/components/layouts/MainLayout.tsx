import { HStack, VStack } from '@chakra-ui/layout';
import { ReactNode } from 'react';
import useAuth from '../../hooks/useAuth';
import { allowed } from '../../hooks/useCheckAuth';
import { matchPathname } from '../../lib/matchPathname';
import Header from './header';

interface MainLayoutProps {
	children: ReactNode;
}

const excluded = allowed.concat('/login');

function MainLayout({ children }: MainLayoutProps) {
	const { user } = useAuth();

	if (matchPathname(excluded)) return <>{children}</>;
	if (!user) return null;

	return (
		<VStack width='100%' height='100vh'>
			<Header />
			<HStack as='main' width='100%' justifyContent='center'>
				{children}
			</HStack>
		</VStack>
	);
}

export default MainLayout;
