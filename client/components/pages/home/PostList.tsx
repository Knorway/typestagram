import axios from 'axios';
import useSWR from 'swr';
import { API_URL } from '../../../api';
import { BearerHeader } from '../../../lib/bearerHeader';
import PostItem from './PostItem';

export interface Post {
	id: number;
	uuid: string;
	content: string;
	img: string;
	comments: any;
	user: User;
	likes: any[];
	createdAt: string;
}
interface Comment {
	[key: string]: string;
}
interface User {
	[key: string]: string;
}

function PostList() {
	const { data: posts } = useSWR(
		`${API_URL}/posts`,
		async (url) => {
			const response = await axios.get(url, { headers: BearerHeader() });
			return response.data;
		},
		{ revalidateOnFocus: false }
	);

	return (
		<>
			{posts?.map((post: Post) => (
				<PostItem post={post} key={post.uuid} />
			))}
		</>
	);
}

export default PostList;
