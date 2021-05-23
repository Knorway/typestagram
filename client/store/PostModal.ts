import { createSlice } from '@reduxjs/toolkit';

interface PostState {
	isOpened: boolean;
}

const initialState = {
	isOpened: false,
} as PostState;

const postModalSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		toggleModal: (state) => {
			state.isOpened = !state.isOpened;
		},
	},
});

export const postModalActions = postModalSlice.actions;
export default postModalSlice;
