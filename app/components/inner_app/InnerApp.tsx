"use client";

import React, { useEffect, useState } from "react";
import DeletePostModal from "@/components/ui/delete-post-modal";
import EditPostModal from "@/components/ui/edit-post-modal";
import SignupModal from "../signup/SignupModal";
import CreatePostForm from "../main_screen/CreatePostForm";
import PostList from "../main_screen/PostList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from "@/components/ui/empty";
import CommentModal from "@/components/ui/comment-modal";
import ConfirmModal from "@/components/ui/confirm-modal";
import { isOwner as utilIsOwner } from "@/utils";
import useInnerAppHandlers from "@/app/hooks/useInnerAppHandlers";
import { usePostFilters } from "@/app/hooks/usePostFilters";
import { usePosts } from "@/hooks/usePosts";
import { useUser } from "../signup/UserProvider";
import type { Post } from "@/app/types";

export default function InnerApp() {
	const { username } = useUser();
	const { data: posts = [], isLoading } = usePosts();

	// centralize handlers/state in a hook
	const handlers = useInnerAppHandlers(username || null);
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

	const [showSkeletons, setShowSkeletons] = useState(false);

	useEffect(() => {
		if (isLoading) {
			setShowSkeletons(true);
		} else {
			const t = setTimeout(() => setShowSkeletons(false), 500);
			return () => clearTimeout(t);
		}
	}, [isLoading]);

	// isOwner helper (delegates to util)
	const isOwner = (p: Post | null | undefined) =>
		utilIsOwner(p?.author, username);

	// UI: search and filters
	const {
		searchQuery,
		setSearchQuery,
		sortMode,
		setSortMode,
		filterHasMedia,
		setFilterHasMedia,
		filteredAndSortedPosts: formattedPosts,
		clearSearch,
	} = usePostFilters(posts);

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

						{/* Filters / Sorting */}
						<section className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div className="flex items-center gap-2 w-full sm:w-auto">
								<Input
									placeholder="Search title, content, author"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery((e.target as HTMLInputElement).value)
									}
									className="min-w-0"
								/>
								<Button
									variant="ghost"
									onClick={clearSearch}
									className="ml-2">
									<Search size={16} />
								</Button>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant={sortMode === "newest" ? "outline" : "ghost"}
									onClick={() => setSortMode("newest")}>
									<ArrowUpDown size={14} /> Newest
								</Button>
								<Button
									variant={sortMode === "oldest" ? "outline" : "ghost"}
									onClick={() => setSortMode("oldest")}>
									<ArrowUpDown size={14} /> Oldest
								</Button>
								<Button
									variant={sortMode === "most_liked" ? "outline" : "ghost"}
									onClick={() => setSortMode("most_liked")}>
									<Star size={14} /> Most liked
								</Button>
								<Button
									variant={filterHasMedia ? "outline" : "ghost"}
									onClick={() => setFilterHasMedia((v) => !v)}>
									<Filter size={14} /> Has media
								</Button>
							</div>
						</section>

						<section>
							{showSkeletons ? (
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="rounded-xl border border-[#e6e6e6] bg-white overflow-hidden p-4">
											<Skeleton className="h-5 w-1/3 mb-3" />
											<Skeleton className="h-4 mb-2" />
											<Skeleton className="h-36 rounded-md mt-2" />
										</div>
									))}
								</div>
							) : formattedPosts.length === 0 ? (
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
