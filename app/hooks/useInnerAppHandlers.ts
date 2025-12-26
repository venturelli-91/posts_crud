"use client";

import React, { useState } from "react";
import useStore from "@/store/useStore";
import { toast } from "sonner";
import { useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/usePosts";
import type { Post } from "@/app/types";

export default function useInnerAppHandlers(username: string | null) {
	const editPostStore = useStore((s) => s.editPost);

	// posts form
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [videoUrl, setVideoUrl] = useState("");

	// post delete modal
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	// post edit modal
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editSelectedPost, setEditSelectedPost] = useState<Post | null>(null);

	// API mutations
	const createPostMutation = useCreatePost();
	const updatePostMutation = useUpdatePost();
	const deletePostMutation = useDeletePost();

	// comments
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [commentSelectedPost, setCommentSelectedPost] = useState<Post | null>(
		null
	);

	const [commentEditOpen, setCommentEditOpen] = useState(false);
	const [commentEditTarget, setCommentEditTarget] = useState<{
		postId: string;
		commentId: string;
		initialText: string;
	} | null>(null);

	const [commentDeleteOpen, setCommentDeleteOpen] = useState(false);
	const [commentDeleteTarget, setCommentDeleteTarget] = useState<{
		postId: string;
		commentId: string;
	} | null>(null);

	function createPost() {
		if (!title.trim() && !content.trim() && images.length === 0 && !videoUrl)
			return;

		// call API to create post, then add returned post to store
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
				onSuccess: (post) => {
					// map API Post to store Post shape
					const mapped: Post = {
						id: String(post.id),
						title: post.title,
						content: post.content,
						author: post.username,
						createdAt: isNaN(Date.parse(post.created_datetime))
							? Date.now()
							: Date.parse(post.created_datetime),
						comments: [],
						images: images ?? [],
						videoUrl: videoUrl || undefined,
						likes: [],
						dislikes: [],
					};
					useStore.setState((s) => ({ posts: [mapped, ...s.posts] }));
					setTitle("");
					setContent("");
					setImages([]);
					setVideoUrl("");
					toast.success("Post created", {
						description: React.createElement(
							"span",
							{ className: "text-white" },
							"Your post was created."
						),
						style: { background: "#16a34a", color: "#ffffff" },
						className: "text-white",
					});
				},
				onError: () => {
					toast.error("Failed to create post", {
						description: React.createElement(
							"span",
							{ className: "text-white" },
							"Unable to create post on server."
						),
						style: { background: "#ef4444", color: "#ffffff" },
						className: "text-white",
					});
				},
			}
		);
	}

	async function confirmRemove() {
		if (!selectedPost) return;
		// call API delete, then remove from store on success
		deletePostMutation.mutate(selectedPost.id, {
			onSuccess: () => {
				useStore.setState((s) => ({
					posts: s.posts.filter((p) => p.id !== selectedPost.id),
				}));
				setSelectedPost(null);
				setModalOpen(false);
				toast.error("Post deleted", {
					description: React.createElement(
						"span",
						{ className: "text-white" },
						"The post was removed."
					),
					style: { background: "#ef4444", color: "#ffffff" },
					className: "text-white",
				});
			},
			onError: () => {
				toast.error("Failed to delete post", {
					description: React.createElement(
						"span",
						{ className: "text-white" },
						"Could not remove post on server."
					),
					style: { background: "#ef4444", color: "#ffffff" },
					className: "text-white",
				});
			},
		});
	}

	function openEditPostModal(p: Post) {
		setEditSelectedPost(p);
		setEditModalOpen(true);
	}

	function openDeletePostModal(p: Post) {
		setSelectedPost(p);
		setModalOpen(true);
	}

	function confirmEdit(updated: { title: string; content: string }) {
		if (!editSelectedPost) return;
		updatePostMutation.mutate(
			{
				id: editSelectedPost.id,
				data: { title: updated.title, content: updated.content },
			},
			{
				onSuccess: (post) => {
					// update store with returned values
					editPostStore(editSelectedPost.id, {
						title: post.title,
						content: post.content,
					});
					setEditSelectedPost(null);
					setEditModalOpen(false);
					toast.success("Post updated", {
						description: React.createElement(
							"span",
							{ className: "text-white" },
							"Your changes were saved."
						),
						style: { background: "#16a34a", color: "#ffffff" },
						className: "text-white",
					});
				},
				onError: () => {
					toast.error("Failed to update post", {
						description: React.createElement(
							"span",
							{ className: "text-white" },
							"Could not save changes on server."
						),
						style: { background: "#ef4444", color: "#ffffff" },
						className: "text-white",
					});
				},
			}
		);
	}

	async function confirmAddComment(text: string) {
		if (!commentSelectedPost) return;
		const author = username ?? "Anonymous";
		useStore.getState().addComment(commentSelectedPost.id, author, text);
		setCommentSelectedPost(null);
		setCommentModalOpen(false);
		toast.success("Comment posted", {
			description: React.createElement(
				"span",
				{ className: "text-white" },
				"Your comment was added."
			),
			style: { background: "#16a34a", color: "#ffffff" },
			className: "text-white",
		});
	}

	function openCommentModal(p: Post) {
		setCommentSelectedPost(p);
		setCommentModalOpen(true);
	}

	function openEditComment(
		postId: string,
		commentId: string,
		initialText: string
	) {
		setCommentEditTarget({ postId, commentId, initialText });
		setCommentEditOpen(true);
	}

	async function confirmEditComment(text: string) {
		if (!commentEditTarget) return;
		useStore
			.getState()
			.editComment(commentEditTarget.postId, commentEditTarget.commentId, text);
		setCommentEditTarget(null);
		setCommentEditOpen(false);
		toast.success("Comment updated", {
			description: React.createElement(
				"span",
				{ className: "text-white" },
				"Your comment was updated."
			),
			style: { background: "#16a34a", color: "#ffffff" },
			className: "text-white",
		});
	}

	function openDeleteComment(postId: string, commentId: string) {
		setCommentDeleteTarget({ postId, commentId });
		setCommentDeleteOpen(true);
	}

	async function confirmDeleteComment() {
		if (!commentDeleteTarget) return;
		useStore
			.getState()
			.deleteComment(commentDeleteTarget.postId, commentDeleteTarget.commentId);
		setCommentDeleteTarget(null);
		setCommentDeleteOpen(false);
		toast.error("Comment deleted", {
			description: React.createElement(
				"span",
				{ className: "text-white" },
				"The comment was removed."
			),
			style: { background: "#ef4444", color: "#ffffff" },
			className: "text-white",
		});
	}

	// modal change handlers used by components to mirror previous behavior
	function onModalOpenChange(v: boolean) {
		setModalOpen(v);
		if (!v) setSelectedPost(null);
	}
	function onEditModalOpenChange(v: boolean) {
		setEditModalOpen(v);
		if (!v) setEditSelectedPost(null);
	}
	function onCommentModalOpenChange(v: boolean) {
		setCommentModalOpen(v);
		if (!v) setCommentSelectedPost(null);
	}
	function onCommentEditOpenChange(v: boolean) {
		setCommentEditOpen(v);
		if (!v) setCommentEditTarget(null);
	}
	function onCommentDeleteOpenChange(v: boolean) {
		setCommentDeleteOpen(v);
		if (!v) setCommentDeleteTarget(null);
	}

	return {
		// form
		title,
		setTitle,
		content,
		setContent,
		createPost,
		images,
		setImages,
		videoUrl,
		setVideoUrl,

		// post delete
		modalOpen,
		selectedPost,
		openDeletePostModal,
		onModalOpenChange,
		confirmRemove,

		// post edit
		editModalOpen,
		editSelectedPost,
		openEditPostModal,
		onEditModalOpenChange,
		confirmEdit,

		// comments
		commentModalOpen,
		commentSelectedPost,
		openCommentModal,
		onCommentModalOpenChange,
		confirmAddComment,

		commentEditOpen,
		commentEditTarget,
		openEditComment,
		onCommentEditOpenChange,
		confirmEditComment,

		commentDeleteOpen,
		commentDeleteTarget,
		openDeleteComment,
		onCommentDeleteOpenChange,
		confirmDeleteComment,
	};
}
