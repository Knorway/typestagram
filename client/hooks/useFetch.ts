import { useState } from 'react';

export default function useFetch(fetchFn, callback = null) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const fetchData = async () => {
		setLoading(true);
		let response;

		try {
			response = await fetchFn();
			setData(response);
			if (callback) {
				callback(response);
			}
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}

		return response;
	};

	return { loading, error, data, fetchData };
}
