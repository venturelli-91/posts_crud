import { create } from "zustand";
import type { Post, StoreState } from "@/app/types";

export const useStore = create<StoreState>((set, get) => ({
	username: null,
	posts: [],
	setUsername: (name) => set({ username: name }),
	setPosts: (list) =>
		set({ posts: [...list].sort((a, b) => b.createdAt - a.createdAt) }),
	// helper to generate stable unique ids (timestamp + random)
	createPost: ({ title, content, author }) => {
		const now = Date.now();
		const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;
		const newPost: Post = {
			id,
			title,
			content,
			author,
			createdAt: now,
			comments: [],
		};
		set((s) => ({ posts: [newPost, ...s.posts] }));
		return newPost;
	},
	addComment: (postId: string, author: string, text: string) => {
		const now = Date.now();
		const comment = {
			id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
			author,
			text,
			createdAt: now,
		};
		set((s) => ({
			posts: s.posts.map((p) =>
				p.id === postId
					? { ...p, comments: [...(p.comments ?? []), comment] }
					: p
			),
		}));
		return comment;
	},
	editComment: (postId: string, commentId: string, text: string) =>
		set((s) => ({
			posts: s.posts.map((p) =>
				p.id === postId
					? {
							...p,
							comments: (p.comments ?? []).map((c) =>
								c.id === commentId ? { ...c, text } : c
							),
					  }
					: p
			),
		})),
	deleteComment: (postId: string, commentId: string) =>
		set((s) => ({
			posts: s.posts.map((p) =>
				p.id === postId
					? {
							...p,
							comments: (p.comments ?? []).filter((c) => c.id !== commentId),
					  }
					: p
			),
		})),
	editPost: (id, data) =>
		set((s) => ({
			posts: s.posts.map((p) => (p.id === id ? { ...p, ...data } : p)),
		})),
	deletePost: (id) =>
		set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
}));

export default useStore;
