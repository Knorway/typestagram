import { Box, ListItem } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { SetStateAction } from 'react';

interface CategoryProps {
	category: any;
	active: string;
	setCategory: SetStateAction<any>;
}

function AccountCategory({ category, active, setCategory }: CategoryProps) {
	const handleCategoryChange = (category) => {
		setCategory(category);
	};

	return (
		<>
			{category.category === active ? (
				<NextLink href={category.link}>
					<ListItem
						cursor='pointer'
						onClick={() => handleCategoryChange(category.category)}
					>
						<Box
							px='1.75rem'
							py='0.75rem'
							borderLeft='2px'
							borderColor='black'
							fontWeight='600'
						>
							{category.category}
						</Box>
					</ListItem>
				</NextLink>
			) : (
				<NextLink href={category.link}>
					<ListItem
						cursor='pointer'
						onClick={() => handleCategoryChange(category.category)}
						borderLeft='2px'
						borderColor='transparent'
					>
						<Box px='1.75rem' py='0.75rem'>
							{category.category}
						</Box>
					</ListItem>
				</NextLink>
			)}
		</>
	);
}

export default AccountCategory;
