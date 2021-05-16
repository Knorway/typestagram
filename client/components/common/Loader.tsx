const Loader = () => {
	return (
		<div
			style={{
				width: '100%',
				position: 'relative',
				zIndex: 9,
			}}
		>
			<img
				src='/YrMx-Spin-1s-200px.gif'
				alt='loader'
				style={{
					width: '100px',
					height: '100px',
					position: 'absolute',
					top: 0,
					left: '50%',
					transform: 'translate(-50%, 50%)',
				}}
			/>
		</div>
	);
};

export default Loader;
