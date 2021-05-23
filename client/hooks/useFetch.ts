import { useState } from 'react';

export default function useFetch(fetchFn) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const fetchData = async () => {
		setLoading(true);
		let response;

		try {
			response = await fetchFn();
			setData(response);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}

		return response;
	};

	return { loading, error, data, fetchData };
}
