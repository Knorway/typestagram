export const matchPathname = (list: string[], allowHome = false) => {
	return list.some((pathname) => {
		if (allowHome && location.pathname === '/') return true;

		return location.href.match(pathname);
	});
};
