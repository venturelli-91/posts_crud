import { create } from "zustand";
import type { Post, StoreState } from "@/app/types";

export const useStore = create<StoreState>((set, get) => ({
	username: null,
	posts: [],
	setUsername: (name) => set({ username: name }),
	setPosts: (list) =>
		set({ posts: [...list].sort((a, b) => b.createdAt - a.createdAt) }),
	// helper to generate stable unique ids (timestamp + random)
	createPost: ({ title, content, author, images, videoUrl }) => {
		const now = Date.now();
		const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;
		const newPost: Post = {
			id,
			title,
			content,
			author,
			createdAt: now,
			comments: [],
			images: images ?? [],
			videoUrl: videoUrl ?? undefined,
			likes: [],
			dislikes: [],
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
			likes: [],
			dislikes: [],
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
	// toggle like for a comment (idempotent per username)
	toggleLikeComment: (
		postId: string,
		commentId: string,
		username: string | null
	) =>
		set((s) => ({
			posts: s.posts.map((p) =>
				p.id === postId
					? {
							...p,
							comments: (p.comments ?? []).map((c) => {
								if (c.id !== commentId) return c;
								const likes = new Set(c.likes ?? []);
								const dislikes = new Set(c.dislikes ?? []);
								if (!username) return c;
								if (likes.has(username)) {
									likes.delete(username);
								} else {
									likes.add(username);
									dislikes.delete(username);
								}
								return {
									...c,
									likes: Array.from(likes),
									dislikes: Array.from(dislikes),
								};
							}),
					  }
					: p
			),
		})),
	// toggle dislike for a comment (idempotent per username)
	toggleDislikeComment: (
		postId: string,
		commentId: string,
		username: string | null
	) =>
		set((s) => ({
			posts: s.posts.map((p) =>
				p.id === postId
					? {
							...p,
							comments: (p.comments ?? []).map((c) => {
								if (c.id !== commentId) return c;
								const likes = new Set(c.likes ?? []);
								const dislikes = new Set(c.dislikes ?? []);
								if (!username) return c;
								if (dislikes.has(username)) {
									dislikes.delete(username);
								} else {
									dislikes.add(username);
									likes.delete(username);
								}
								return {
									...c,
									likes: Array.from(likes),
									dislikes: Array.from(dislikes),
								};
							}),
					  }
					: p
			),
		})),
	// reshare a post (creates a new post by the current user copying the original)
	resharePost: (postId: string, by: string | null, comment?: string) =>
		set((s) => {
			if (!by) return s;
			const orig = s.posts.find((p) => p.id === postId);
			if (!orig) return s;
			const now = Date.now();
			const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;
			const newPost: Post = {
				id,
				title: `Reshared: ${orig.title}`,
				content: orig.content,
				author: by,
				createdAt: now,
				comments: [],
				sharedComment: comment,
			};
			return { posts: [newPost, ...s.posts] };
		}),
	// toggle like for a post
	toggleLikePost: (postId: string, username: string | null) =>
		set((s) => ({
			posts: s.posts.map((p) => {
				if (p.id !== postId) return p;
				if (!username) return p;
				const likes = new Set(p.likes ?? []);
				const dislikes = new Set(p.dislikes ?? []);
				if (likes.has(username)) {
					likes.delete(username);
				} else {
					likes.add(username);
					dislikes.delete(username);
				}
				return {
					...p,
					likes: Array.from(likes),
					dislikes: Array.from(dislikes),
				};
			}),
		})),
	// toggle dislike for a post
	toggleDislikePost: (postId: string, username: string | null) =>
		set((s) => ({
			posts: s.posts.map((p) => {
				if (p.id !== postId) return p;
				if (!username) return p;
				const likes = new Set(p.likes ?? []);
				const dislikes = new Set(p.dislikes ?? []);
				if (dislikes.has(username)) {
					dislikes.delete(username);
				} else {
					dislikes.add(username);
					likes.delete(username);
				}
				return {
					...p,
					likes: Array.from(likes),
					dislikes: Array.from(dislikes),
				};
			}),
		})),
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
