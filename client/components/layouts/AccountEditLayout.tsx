import { HStack, UnorderedList, VStack } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import AccountCategory from '../pages/account/edit/AccountCategory';

export const categoryList = ['프로필 편집', '비밀번호 변경'];
export const categoryMapper = (category: string, userId: string) => {
	switch (category) {
		case '프로필 편집':
			return { category, link: `/account/${userId}/edit` };
		case '비밀번호 변경':
			return { category, link: `/account/${userId}/edit/password` };
	}
};

interface AccountEditProps {
	children: ReactNode;
}

function AccountEditLayout({ children }: AccountEditProps) {
	const [currentCategory, setcurrentCategory] = useState('프로필 편집');
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		if (!router.isReady) return;
		if (router.query.uuid !== user.uuid) router.push('/');
	}, [router.isReady]);

	if (router.query.uuid !== user.uuid) return null;

	return (
		<HStack
			border='1px'
			borderRadius='3px'
			borderColor='gray.300'
			maxW='936px'
			w='100%'
			minH='85vh'
			alignItems='stretch'
			mt='1.5rem'
		>
			<VStack
				alignItems='flex-start'
				py='0.75rem'
				pr='2rem'
				pt='0'
				borderRight='1px'
				borderColor='gray.300'
				flex='1'
				minW='150px'
			>
				<UnorderedList
					listStyleType='none'
					fontSize='1rem'
					fontWeight='400'
					ml='0'
				>
					{categoryList.map((category) => (
						<AccountCategory
							key={category}
							category={categoryMapper(category, user.uuid)}
							active={currentCategory}
							setCategory={setcurrentCategory}
						/>
					))}
				</UnorderedList>
			</VStack>
			<VStack flex='5'>{children}</VStack>
		</HStack>
	);
}

export default AccountEditLayout;
