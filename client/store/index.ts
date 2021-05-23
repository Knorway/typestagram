import {
	combineReducers,
	configureStore,
	getDefaultMiddleware,
	Reducer,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postModalSlice from './PostModal';

const combinedReducer = combineReducers({
	postModal: postModalSlice.reducer,
});
const rootReducer: Reducer = (state, action) => {
	switch (action.type) {
		case HYDRATE:
			return action.type;
		default:
			return combinedReducer(state, action);
	}
};

const createStore = () => {
	const middleware = getDefaultMiddleware();
	const store = configureStore({
		reducer: rootReducer,
		middleware,
	});
	return store;
};

const wrapper = createWrapper(createStore, {
	debug: true,
});

const store = createStore();
export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default wrapper;
