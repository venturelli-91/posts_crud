"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPosts, createPost, updatePost, deletePost } from "@/lib/api";

export function usePosts() {
	return useQuery({
		queryKey: ["posts"],
		queryFn: () => listPosts(),
		staleTime: 1000 * 60, // 1 minute
	});
}

export function useCreatePost() {
	const qc = useQueryClient();
	interface CreatePostPayload {
		username: string;
		title: string;
		content: string;
	}

	interface Post {
		id: number | string;
		username: string;
		title: string;
		content: string;
		// add other fields as needed
	}

	return useMutation<Post, Error, CreatePostPayload>({
		mutationFn: (payload: CreatePostPayload) => createPost(payload) as Promise<Post>,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
	});
}

interface UpdatePostPayload {
	id: number | string;
	data: { title?: string; content?: string };
}

interface Post {
	id: number | string;
	username: string;
	title: string;
	content: string;
	// add other fields as needed
}

export function useUpdatePost() {
	const qc = useQueryClient();
	return useMutation<Post, Error, UpdatePostPayload>({
		mutationFn: ({ id, data }: UpdatePostPayload) => updatePost(id, data) as Promise<Post>,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
	});
}

export function useDeletePost() {
	const qc = useQueryClient();
	return useMutation<void, Error, number | string>({
		mutationFn: (id: number | string) => deletePost(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
	});
}
