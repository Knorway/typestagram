export const isEmptyObject = (param) => {
	if (!param) return false;
	return Object.keys(param).length === 0 && param.constructor === Object;
};
