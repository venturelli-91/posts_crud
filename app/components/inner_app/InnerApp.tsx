"use client";

import React, { useEffect, useMemo, useState } from "react";
import DeletePostModal from "@/components/ui/delete-post-modal";
import EditPostModal from "@/components/ui/edit-post-modal";
import SignupModal from "../signup/SignupModal";
import CreatePostForm from "../main_screen/CreatePostForm";
import PostList from "../main_screen/PostList";
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from "@/components/ui/empty";
import CommentModal from "@/components/ui/comment-modal";
import ConfirmModal from "@/components/ui/confirm-modal";
import useStore from "@/store/useStore";
// toast used inside handlers hook
import { isOwner as utilIsOwner } from "@/utils";
import useInnerAppHandlers from "@/app/hooks/useInnerAppHandlers";
import type { Post, StoreState } from "@/app/types";

// prevent reseeding during Strict Mode / HMR

export default function InnerApp() {
	const username: string | null = useStore(
		(s: { username: string | null }) => s.username
	);
	const createPostStore = useStore(
		(s: {
			createPost: (post: {
				title: string;
				content: string;
				author: string;
				images?: string[];
				videoUrl?: string;
			}) => void;
		}) => s.createPost
	);

	// types imported from @/types

	const posts = useStore((s: StoreState) => s.posts);

	// centralize handlers/state in a hook
	const handlers = useInnerAppHandlers(username);
	const {
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
		openDeleteComment,
		onCommentDeleteOpenChange,
		confirmDeleteComment,
	} = handlers;

	// initial sample posts (only if store is empty)
	useEffect(() => {
		if (posts.length === 0) {
			// seed example posts once
			const seed: Post[] = [
				{
					id: "1",
					title: "My First Post at CodeLeap Network!",
					content:
						"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel sem. Nullam cursus lacinia erat.",
					author: "Victor",
					createdAt: Date.now() - 1000 * 60 * 25,
				},
				{
					id: "2",
					title: "My Second Post at CodeLeap Network!",
					content:
						"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel sem. Nullam cursus lacinia erat.",
					author: "Vini",
					createdAt: Date.now() - 1000 * 60 * 45,
				},
			];
			// seed via createPost action so store subscriptions update reliably
			seed.forEach((p) =>
				createPostStore({
					title: p.title,
					content: p.content,
					author: p.author,
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// isOwner helper (delegates to util)
	const isOwner = (p: Post | null | undefined) =>
		utilIsOwner(p?.author, username);

	const formattedPosts = useMemo(
		() => [...posts].sort((a, b) => b.createdAt - a.createdAt),
		[posts]
	);

	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 60000);
		return () => clearInterval(interval);
	}, []);

	if (!username) {
		return (
			<div className="min-h-screen bg-[#DDDDDD] flex items-center justify-center px-4">
				<SignupModal />
			</div>
		);
	}

	// confirmEdit handled by hook (exposed as `confirmEdit`)

	return (
		<main className="min-h-screen bg-[#DDDDDD] flex flex-col items-center py-6 px-4">
			<div className="w-full max-w-205">
				<div className="bg-white rounded-xl border border-[#e6e6e6] overflow-hidden">
					<header className="bg-[#7695EC] px-6 py-4 text-white">
						<h2 className="font-semibold">CodeLeap Network</h2>
					</header>

					<div className="p-6">
						<section className="mb-6">
							<CreatePostForm
								title={title}
								content={content}
								setTitle={setTitle}
								setContent={setContent}
								onSubmit={createPost}
								images={images}
								setImages={setImages}
								videoUrl={videoUrl}
								setVideoUrl={setVideoUrl}
							/>
						</section>

						<section>
							{formattedPosts.length === 0 ? (
								<Empty>
									<EmptyHeader>
										<EmptyTitle>No posts yet</EmptyTitle>
										<EmptyDescription>
											Create the first post to get started.
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							) : (
								<PostList
									posts={formattedPosts}
									username={username}
									onOpenComment={(p) => openCommentModal(p)}
									onEditPost={(p) => openEditPostModal(p)}
									onDeletePost={(p) => openDeletePostModal(p)}
									onStartEditComment={openEditComment}
									onRemoveComment={(postId, commentId) =>
										openDeleteComment(postId, commentId)
									}
								/>
							)}
						</section>
					</div>
				</div>
			</div>
			<DeletePostModal
				open={modalOpen}
				onOpenChange={onModalOpenChange}
				onConfirm={confirmRemove}
				postTitle={selectedPost?.title}
			/>
			<EditPostModal
				open={editModalOpen}
				onOpenChange={onEditModalOpenChange}
				onConfirm={confirmEdit}
				postTitle={editSelectedPost?.title}
				postContent={editSelectedPost?.content}
			/>
			<CommentModal
				open={commentModalOpen}
				onOpenChange={onCommentModalOpenChange}
				initialValue={
					commentSelectedPost ? `@${commentSelectedPost.author} ` : ""
				}
				onConfirm={confirmAddComment}
			/>
			{/* Edit comment modal (reuses CommentModal) */}
			<CommentModal
				open={commentEditOpen}
				onOpenChange={onCommentEditOpenChange}
				initialValue={commentEditTarget?.initialText ?? ""}
				onConfirm={confirmEditComment}
			/>

			{/* Confirm delete comment */}
			<ConfirmModal
				open={commentDeleteOpen}
				onOpenChange={onCommentDeleteOpenChange}
				title="Delete comment"
				description="Are you sure you want to delete this comment?"
				onConfirm={confirmDeleteComment}
				confirmLabel="Delete"
			/>
		</main>
	);
}
