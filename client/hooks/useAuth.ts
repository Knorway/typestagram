import useSWR from 'swr';

const useAuth = () => {
	const { data, isValidating } = useSWR('/auth/validate', {
		revalidateOnFocus: false,
		revalidateOnMount: false,
	});

	return { user: data, isValidating };
};

export default useAuth;
