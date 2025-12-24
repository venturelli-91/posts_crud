import { create } from "zustand";

export type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
};

type StoreState = {
	username: string | null;
	posts: Post[];
	setUsername: (name: string | null) => void;
	setPosts: (list: Post[]) => void;
	createPost: (p: { title: string; content: string; author: string }) => Post;
	editPost: (id: string, data: { title: string; content: string }) => void;
	deletePost: (id: string) => void;
};

export const useStore = create<StoreState>((set, get) => ({
	username: null,
	posts: [],
	setUsername: (name) => set({ username: name }),
	setPosts: (list) =>
		set({ posts: [...list].sort((a, b) => b.createdAt - a.createdAt) }),
	createPost: ({ title, content, author }) => {
		const newPost: Post = {
			id: String(Date.now()),
			title,
			content,
			author,
			createdAt: Date.now(),
		};
		set((s) => ({ posts: [newPost, ...s.posts] }));
		return newPost;
	},
	editPost: (id, data) =>
		set((s) => ({
			posts: s.posts.map((p) => (p.id === id ? { ...p, ...data } : p)),
		})),
	deletePost: (id) =>
		set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
}));

export default useStore;
