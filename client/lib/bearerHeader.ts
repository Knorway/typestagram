export const BearerHeader = () => {
	const token = JSON.parse(localStorage.getItem('user'));
	return { Authorization: `Bearer ${token}` };
};
