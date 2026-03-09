"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useToastNotifications } from "./useToastNotifications";
import type { Post, Comment } from "@/app/types";

export function useCommentActions(username: string | null) {
	const { showSuccess, showError } = useToastNotifications();
	const qc = useQueryClient();

	const addComment = (postId: string, text: string) => {
		try {
			const now = Date.now();
			const comment: Comment = {
				id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
				author: username ?? "Anonymous",
				text,
				createdAt: now,
				likes: [],
				dislikes: [],
			};

			qc.setQueryData<Post[] | undefined>(["posts"], (posts) => {
				if (!posts) return posts;
				return posts.map((p) =>
					p.id === postId
						? { ...p, comments: [...(p.comments ?? []), comment] }
						: p,
				);
			});

			showSuccess("Comment posted", "Your comment was added.");
		} catch (err) {
			showError("Failed to add comment", "Could not add comment.");
		}
	};

	const editComment = (postId: string, commentId: string, text: string) => {
		try {
			qc.setQueryData<Post[] | undefined>(["posts"], (posts) => {
				if (!posts) return posts;
				return posts.map((p) =>
					p.id === postId
						? {
								...p,
								comments: (p.comments ?? []).map((c) =>
									c.id === commentId ? { ...c, text } : c,
								),
							}
						: p,
				);
			});

			showSuccess("Comment updated", "Your comment was updated.");
		} catch (err) {
			showError("Failed to update comment", "Could not update comment.");
		}
	};

	const deleteComment = (postId: string, commentId: string) => {
		try {
			qc.setQueryData<Post[] | undefined>(["posts"], (posts) => {
				if (!posts) return posts;
				return posts.map((p) =>
					p.id === postId
						? {
								...p,
								comments: (p.comments ?? []).filter((c) => c.id !== commentId),
							}
						: p,
				);
			});

			showSuccess("Comment deleted", "The comment was removed.");
		} catch (err) {
			showError("Failed to delete comment", "Could not delete comment.");
		}
	};

	return {
		addComment,
		editComment,
		deleteComment,
	};
}
