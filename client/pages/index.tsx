import { Fade } from '@chakra-ui/transition';
import HomePage from '../components/pages/home';

function Home() {
	return (
		<Fade in={true}>
			<HomePage />
		</Fade>
	);
}

export default Home;
