"use client";

import useStore from "@/store/useStore";
import { useToastNotifications } from "./useToastNotifications";

export function useCommentActions(username: string | null) {
	const { showSuccess, showError } = useToastNotifications();
	const store = useStore.getState();

	const addComment = (postId: string, text: string) => {
		try {
			store.addComment(postId, username ?? "Anonymous", text);
			showSuccess("Comment posted", "Your comment was added.");
		} catch (err) {
			showError("Failed to add comment", "Could not add comment.");
		}
	};

	const editComment = (postId: string, commentId: string, text: string) => {
		try {
			store.editComment(postId, commentId, text);
			showSuccess("Comment updated", "Your comment was updated.");
		} catch (err) {
			showError("Failed to update comment", "Could not update comment.");
		}
	};

	const deleteComment = (postId: string, commentId: string) => {
		try {
			store.deleteComment(postId, commentId);
			showError("Comment deleted", "The comment was removed.");
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
