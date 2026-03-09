"use client";

import { usePostForm } from "./usePostForm";
import { useModalState } from "./useModalState";
import { usePost } from "./usePost";
import type { Post } from "@/app/types";

export function usePostUI(username: string | null) {
	const form = usePostForm();
	const post = usePost(username);

	const deleteModal = useModalState<Post>();
	const editModal = useModalState<Post>();
	const commentModal = useModalState<Post>();
	const commentEditModal = useModalState<{
		postId: string;
		commentId: string;
		initialText: string;
	}>();
	const commentDeleteModal = useModalState<{
		postId: string;
		commentId: string;
	}>();

	const handleCreatePost = () => {
		if (form.isEmpty()) return;

		post.createPost(form.title, form.content, form.images, form.videoUrl);
		form.reset();
	};

	const handleDeletePost = (postData: Post) => {
		deleteModal.open(postData);
	};

	const handleConfirmDeletePost = () => {
		if (!deleteModal.data) return;
		post.deletePost(deleteModal.data.id, () => {
			deleteModal.close();
		});
	};

	const handleEditPost = (postData: Post) => {
		editModal.open(postData);
	};

	const handleConfirmEditPost = (updated: {
		title: string;
		content: string;
	}) => {
		if (!editModal.data) return;
		post.editPost(
			editModal.data.id,
			updated.title,
			updated.content,
			() => {
				editModal.close();
			},
		);
	};

	const handleAddComment = (text: string) => {
		if (!commentModal.data) return;
		post.addComment(commentModal.data.id, text);
		commentModal.close();
	};

	const handleOpenComment = (postData: Post) => {
		commentModal.open(postData);
	};

	const handleEditComment = (
		postId: string,
		commentId: string,
		initialText: string,
	) => {
		commentEditModal.open({ postId, commentId, initialText });
	};

	const handleConfirmEditComment = (text: string) => {
		if (!commentEditModal.data) return;
		post.editComment(
			commentEditModal.data.postId,
			commentEditModal.data.commentId,
			text,
		);
		commentEditModal.close();
	};

	const handleDeleteComment = (postId: string, commentId: string) => {
		commentDeleteModal.open({ postId, commentId });
	};

	const handleConfirmDeleteComment = () => {
		if (!commentDeleteModal.data) return;
		post.deleteComment(
			commentDeleteModal.data.postId,
			commentDeleteModal.data.commentId,
		);
		commentDeleteModal.close();
	};

	return {
		// form
		title: form.title,
		setTitle: form.setTitle,
		content: form.content,
		setContent: form.setContent,
		createPost: handleCreatePost,
		images: form.images,
		setImages: form.setImages,
		videoUrl: form.videoUrl,
		setVideoUrl: form.setVideoUrl,

		// post delete
		modalOpen: deleteModal.isOpen,
		selectedPost: deleteModal.data,
		openDeletePostModal: handleDeletePost,
		onModalOpenChange: deleteModal.toggle,
		confirmRemove: handleConfirmDeletePost,

		// post edit
		editModalOpen: editModal.isOpen,
		editSelectedPost: editModal.data,
		openEditPostModal: handleEditPost,
		onEditModalOpenChange: editModal.toggle,
		confirmEdit: handleConfirmEditPost,

		// comments
		commentModalOpen: commentModal.isOpen,
		commentSelectedPost: commentModal.data,
		openCommentModal: handleOpenComment,
		onCommentModalOpenChange: commentModal.toggle,
		confirmAddComment: handleAddComment,

		commentEditOpen: commentEditModal.isOpen,
		commentEditTarget: commentEditModal.data,
		openEditComment: handleEditComment,
		onCommentEditOpenChange: commentEditModal.toggle,
		confirmEditComment: handleConfirmEditComment,

		commentDeleteOpen: commentDeleteModal.isOpen,
		openDeleteComment: handleDeleteComment,
		onCommentDeleteOpenChange: commentDeleteModal.toggle,
		confirmDeleteComment: handleConfirmDeleteComment,
	};
}
