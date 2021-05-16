import axios from 'axios';
import useSWR from 'swr';
import PostItem from './PostItem';

export interface Post {
	id: number;
	title: string;
	img: string;
	creator: string;
	comments: Comment[];
}
interface Comment {
	[key: string]: string;
}

function PostList() {
	const { data } = useSWR('http://localhost:9090/posts', async (url) => {
		const response = await axios.get(url);
		return response.data;
	});

	return (
		<>
			{data?.map((post: Post) => (
				<PostItem post={post} key={post.id} />
			))}
		</>
	);
}

export default PostList;
