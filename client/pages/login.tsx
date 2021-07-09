import { Fade } from '@chakra-ui/transition';
import LoginPage from '../components/pages/login';

function Login() {
	return (
		<Fade in={true}>
			<LoginPage />
		</Fade>
	);
}

export default Login;
