"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPosts, createPost, updatePost, deletePost } from "@/lib/api";
import { mapApiPostToDomain } from "@/lib/mappers";
import type {
	ApiPost,
	ApiCreatePostPayload,
	ApiUpdatePostPayload,
} from "@/types/api";
import type { Post } from "@/app/types";

export function usePosts() {
	return useQuery<Post[], Error>({
		queryKey: ["posts"],
		queryFn: async () => {
			const apiPosts = await listPosts();
			return apiPosts.map(mapApiPostToDomain);
		},
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
