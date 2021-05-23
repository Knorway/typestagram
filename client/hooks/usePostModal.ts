import { useAppDispatch, useAppSelector } from '../store';
import { postModalActions } from '../store/PostModal';

export function usePostModal() {
	const toggled = useAppSelector((state) => state.postModal.isOpened);
	const dispatch = useAppDispatch();

	const toggleHandler = () => dispatch(postModalActions.toggleModal());

	return { toggled, toggleHandler };
}
