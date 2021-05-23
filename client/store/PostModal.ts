import { createSlice } from '@reduxjs/toolkit';

interface PostState {
	isOpened: boolean;
	editOn: any;
}

const initialState = {
	isOpened: false,
	editOn: null,
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
	},
});

export const postModalActions = postModalSlice.actions;
export default postModalSlice;
