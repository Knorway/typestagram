import { createSlice } from '@reduxjs/toolkit';

interface PostState {
	// isLiked: boolean;
	isOpened: boolean;
}

const initialState = {
	// isLiked: false,
	isOpened: false,
} as PostState;

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		// toggleLike: (state) => {
		// 	state.isLiked = !state.isLiked;
		// },
		togglepostmodal: (state) => {
			state.isOpened = !state.isOpened;
		},
	},
});

export const postActions = postSlice.actions;
export default postSlice;
