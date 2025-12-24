export type Comment = {
	id: string;
	author: string;
	text: string;
	createdAt: number;
};

export type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
	comments?: Comment[];
};

export type StoreState = {
	username: string | null;
	posts: Post[];
	setUsername: (name: string | null) => void;
	setPosts: (list: Post[]) => void;
	createPost: (p: { title: string; content: string; author: string }) => Post;
	addComment: (
		postId: string,
		author: string,
		text: string
	) => {
		id: string;
		author: string;
		text: string;
		createdAt: number;
	};
	editComment: (postId: string, commentId: string, text: string) => void;
	deleteComment: (postId: string, commentId: string) => void;
	editPost: (id: string, data: { title: string; content: string }) => void;
	deletePost: (id: string) => void;
};

export type PostItemProps = {
	post: Post;
	username: string | null;
	onOpenComment: () => void;
	onEditPost: () => void;
	onDeletePost: () => void;
	onStartEditComment: (
		postId: string,
		commentId: string,
		initialText: string
	) => void;
	onRemoveComment: (
		postId: string,
		commentId: string,
		commentAuthor?: string
	) => void;
};
