import { Fade } from '@chakra-ui/transition';
import RegisterPage from '../components/pages/register';

function Register() {
	return (
		<Fade in={true}>
			<RegisterPage />;
		</Fade>
	);
}

export default Register;
