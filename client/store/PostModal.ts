import { createSlice } from '@reduxjs/toolkit';

interface PostState {
	isOpened: boolean;
	editOn: any;
	isLoading: boolean;
}

const initialState = {
	isOpened: false,
	editOn: null,
	isLoading: false,
} as PostState;

const postModalSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		toggleModal: (state) => {
			state.isOpened = !state.isOpened;
			if (!state.isOpened && state.editOn) state.editOn = null;
		},
		editOn: (state, action) => {
			state.editOn = action.payload;
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
	},
});

export const postModalActions = postModalSlice.actions;
export default postModalSlice;
