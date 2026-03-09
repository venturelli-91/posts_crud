"use client";

import useStore from "@/store/useStore";
import { useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/usePosts";
import { useToastNotifications } from "./useToastNotifications";
import { mapApiPostToDomain } from "@/lib/mappers";
import type { Post } from "@/app/types";

export function usePostActions(username: string | null) {
	const { showSuccess, showError } = useToastNotifications();
	const createPostMutation = useCreatePost();
	const updatePostMutation = useUpdatePost();
	const deletePostMutation = useDeletePost();

	const createPost = (
		title: string,
		content: string,
		images: string[],
		videoUrl: string,
	) => {
		if (!title.trim() && !content.trim() && images.length === 0 && !videoUrl) {
			return;
		}

		createPostMutation.mutate(
			{
				username: username ?? "Anonymous",
				title:
					title.trim() ||
					(videoUrl
						? `Video post by @${username ?? "Anonymous"}`
						: `Untitled post by @${username ?? "Anonymous"}`),
				content: content.trim(),
			},
			{
				onSuccess: (apiPost) => {
					const mapped: Post = {
						...mapApiPostToDomain(apiPost),
						images: images ?? [],
						videoUrl: videoUrl || undefined,
					};
					useStore.setState((s) => ({ posts: [mapped, ...s.posts] }));
					showSuccess("Post created", "Your post was created.");
				},
				onError: () => {
					showError("Failed to create post", "Unable to create post on server.");
				},
			},
		);
	};

	const editPost = (
		postId: string,
		title: string,
		content: string,
		onSuccess?: () => void,
	) => {
		updatePostMutation.mutate(
			{
				id: postId,
				data: { title, content },
			},
			{
				onSuccess: (apiPost) => {
					const editPostStore = useStore.getState().editPost;
					editPostStore(postId, {
						title: apiPost.title,
						content: apiPost.content,
					});
					showSuccess("Post updated", "Your changes were saved.");
					onSuccess?.();
				},
				onError: () => {
					showError("Failed to update post", "Could not save changes on server.");
				},
			},
		);
	};

	const deletePost = (
		postId: string,
		onSuccess?: () => void,
	) => {
		deletePostMutation.mutate(postId, {
			onSuccess: () => {
				useStore.setState((s) => ({
					posts: s.posts.filter((p) => p.id !== postId),
				}));
				showError("Post deleted", "The post was removed.");
				onSuccess?.();
			},
			onError: () => {
				showError("Failed to delete post", "Could not remove post on server.");
			},
		});
	};

	return {
		createPost,
		editPost,
		deletePost,
	};
}
