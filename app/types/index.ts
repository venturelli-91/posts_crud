export type Comment = {
	id: string;
	author: string;
	text: string;
	createdAt: number;
	likes?: string[];
	dislikes?: string[];
};

export type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
	comments?: Comment[];
	likes?: string[];
	dislikes?: string[];
	images?: string[];
	videoUrl?: string;
	sharedComment?: string;
};

export type StoreState = {
	username: string | null;
	posts: Post[];
	setUsername: (name: string | null) => void;
	setPosts: (list: Post[]) => void;
	createPost: (p: {
		title: string;
		content: string;
		author: string;
		images?: string[];
		videoUrl?: string;
	}) => Post;
	addComment: (
		postId: string,
		author: string,
		text: string,
	) => {
		id: string;
		author: string;
		text: string;
		createdAt: number;
		likes?: string[];
		dislikes?: string[];
	};
	editComment: (postId: string, commentId: string, text: string) => void;
	deleteComment: (postId: string, commentId: string) => void;
	toggleLikeComment: (postId: string, commentId: string, username: string | null) => void;
	toggleDislikeComment: (postId: string, commentId: string, username: string | null) => void;
	resharePost: (postId: string, by: string | null, comment?: string) => void;
	toggleLikePost: (postId: string, username: string | null) => void;
	toggleDislikePost: (postId: string, username: string | null) => void;
	editPost: (id: string, data: { title: string; content: string }) => void;
	deletePost: (id: string) => void;
};

export type PostItemProps = {
	post: Post;
	username: string | null;
	onOpenComment: () => void;
	onEditPost: () => void;
	onDeletePost: () => void;
	onStartEditComment: (postId: string, commentId: string, initialText: string) => void;
	onRemoveComment: (postId: string, commentId: string, commentAuthor?: string) => void;
};
