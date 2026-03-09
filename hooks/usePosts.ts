"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPosts, createPost, updatePost, deletePost } from "@/lib/api";
import type {
	ApiPost,
	ApiCreatePostPayload,
	ApiUpdatePostPayload,
} from "@/types/api";

export function usePosts() {
	return useQuery<ApiPost[], Error>({
		queryKey: ["posts"],
		queryFn: () => listPosts(),
		staleTime: 1000 * 60, // 1 minute
	});
}

export function useCreatePost() {
	const qc = useQueryClient();

	return useMutation<ApiPost, Error, ApiCreatePostPayload>({
		mutationFn: (payload: ApiCreatePostPayload) => createPost(payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
	});
}

export function useUpdatePost() {
	const qc = useQueryClient();
	return useMutation<ApiPost, Error, ApiUpdatePostPayload>({
		mutationFn: ({ id, data }: ApiUpdatePostPayload) => updatePost(id, data),
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
