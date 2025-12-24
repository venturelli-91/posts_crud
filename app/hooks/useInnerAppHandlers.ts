"use client";

import { useState } from "react";
import useStore from "@/store/useStore";
import { toast } from "sonner";
import type { Post } from "@/app/types";

export default function useInnerAppHandlers(username: string | null) {
	const createPostStore = useStore((s) => s.createPost);
	const editPostStore = useStore((s) => s.editPost);
	const deletePostStore = useStore((s) => s.deletePost);

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
		createPostStore({
			title:
				title.trim() ||
				(videoUrl
					? `Video post by @${username ?? "Anonymous"}`
					: `Untitled post by @${username ?? "Anonymous"}`),
			content: content.trim(),
			author: username ?? "Anonymous",
			images: images.length ? images : undefined,
			videoUrl: videoUrl || undefined,
		});
		setTitle("");
		setContent("");
		setImages([]);
		setVideoUrl("");
		toast.success("Post created", {
			description: "Your post was created.",
			style: { background: "#16a34a", color: "#ffffff" },
			className: "text-white",
		});
	}

	function openDeletePostModal(p: Post) {
		setSelectedPost(p);
		setModalOpen(true);
	}

	async function confirmRemove() {
		if (!selectedPost) return;
		// only call delete; owner checks should be done by caller
		deletePostStore(selectedPost.id);
		setSelectedPost(null);
		setModalOpen(false);
		toast.error("Post deleted", {
			description: "The post was removed.",
			style: { background: "#ef4444", color: "#ffffff" },
			className: "text-white",
		});
	}

	function openEditPostModal(p: Post) {
		setEditSelectedPost(p);
		setEditModalOpen(true);
	}

	function confirmEdit(updated: { title: string; content: string }) {
		if (!editSelectedPost) return;
		editPostStore(editSelectedPost.id, {
			title: updated.title,
			content: updated.content,
		});
		setEditSelectedPost(null);
		setEditModalOpen(false);
		toast.success("Post updated", {
			description: "Your changes were saved.",
			style: { background: "#16a34a", color: "#ffffff" },
			className: "text-white",
		});
	}

	async function confirmAddComment(text: string) {
		if (!commentSelectedPost) return;
		const author = username ?? "Anonymous";
		useStore.getState().addComment(commentSelectedPost.id, author, text);
		setCommentSelectedPost(null);
		setCommentModalOpen(false);
		toast.success("Comment posted", {
			description: "Your comment was added.",
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
			description: "Your comment was updated.",
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
			description: "The comment was removed.",
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
