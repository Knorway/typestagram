import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'loading',
	initialState: {},
	reducers: {
		startLoading(state, action) {
			state[action.payload] = true;
		},
	},
});

export default slice;
