"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPosts, createPost, updatePost, deletePost } from "@/lib/api";
import { Post, CreatePostPayload, UpdatePostPayload } from "@/types/posts";

export function usePosts() {
	return useQuery<Post[], Error>({
		queryKey: ["posts"],
		queryFn: () => listPosts(),
		staleTime: 1000 * 60, // 1 minute
	});
}

export function useCreatePost() {
	const qc = useQueryClient();

	return useMutation<Post, Error, CreatePostPayload>({
		mutationFn: (payload: CreatePostPayload) => createPost(payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
	});
}

export function useUpdatePost() {
	const qc = useQueryClient();
	return useMutation<Post, Error, UpdatePostPayload>({
		mutationFn: ({ id, data }: UpdatePostPayload) => updatePost(id, data),
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
