import { Button, Link, Text } from '@chakra-ui/react';
import { API_URL } from '../../../api';

interface SocialButtonProps {
	provider: 'google' | 'github' | 'naver';
}

const NaverIcon = () => (
	<img
		style={{ width: '20px', height: '20px' }}
		src='naver_icon.ico'
		alt='naver logo'
	/>
);
const GithubIcon = () => (
	<img
		style={{ width: '20px', height: '20px' }}
		src='github_icon.png'
		alt='github logo'
	/>
);
const GoogleIcon = () => (
	<img
		style={{ width: '20px', height: '20px' }}
		src='google_icon.ico'
		alt='google logo'
	/>
);
const LeftIcons = (provider: string) => {
	if (provider === 'github') return <GithubIcon />;
	if (provider === 'google') return <GoogleIcon />;
	if (provider === 'naver') return <NaverIcon />;
};

function SocialLoginButton({ provider }: SocialButtonProps) {
	return (
		<Link
			href={`${API_URL}/auth/${provider}`}
			_hover={{ textDecoration: 'none' }}
			_focus={{ outline: 'none', border: 'none' }}
			width='100%'
		>
			<Button
				leftIcon={LeftIcons(provider)}
				display='flex'
				justifyContent='flex-start'
				bg='white'
				border='1px'
				borderColor='gray.200'
				borderRadius='3px'
				fontSize='14px'
				isFullWidth
				mb='6px'
				_focus={{ outline: 'none' }}
			>
				<Text display='inline-block' ml='2.25rem' fontWeight='400'>
					{provider === 'google' && '구글로'}
					{provider === 'naver' && '네이버로'}
					{provider === 'github' && '깃헙으로'} 로그인
				</Text>
			</Button>
		</Link>
	);
}

export default SocialLoginButton;
