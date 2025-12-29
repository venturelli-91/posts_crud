"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import DeletePostModal from "@/components/ui/delete-post-modal";
import EditPostModal from "@/components/ui/edit-post-modal";
import SignupModal from "../signup/SignupModal";
import CreatePostForm from "../main_screen/CreatePostForm";
import PostList from "../main_screen/PostList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import CommentModal from "@/components/ui/comment-modal";
import ConfirmModal from "@/components/ui/confirm-modal";
import useStore from "@/store/useStore";
// toast used inside handlers hook
import { isOwner as utilIsOwner } from "@/utils";
import useInnerAppHandlers from "@/app/hooks/useInnerAppHandlers";
import type { Post, StoreState } from "@/app/types";

// prevent reseeding during Strict Mode / HMR

export default function InnerApp() {
	const username: string | null = useStore((s: { username: string | null }) => s.username);
	const createPostStore = useStore(
		(s: {
			createPost: (post: {
				title: string;
				content: string;
				author: string;
				images?: string[];
				videoUrl?: string;
			}) => void;
		}) => s.createPost,
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

	// initial sample posts (only if store is empty) + show skeletons briefly on first seed
	const [showSkeletons, setShowSkeletons] = useState(false);
	const seededRef = useRef(false);

	useEffect(() => {
		// seed example posts once and show skeletons briefly while seeding
		if (posts.length === 0 && !seededRef.current) {
			seededRef.current = true;
			setShowSkeletons(true);
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
				}),
			);
			// keep skeletons visible briefly for smoother UX
			const t = setTimeout(() => setShowSkeletons(false), 500);
			return () => clearTimeout(t);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// isOwner helper (delegates to util)
	const isOwner = (p: Post | null | undefined) => utilIsOwner(p?.author, username);

	// UI: search and filters
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<"newest" | "oldest" | "most_liked">("newest");
	const [filterHasMedia, setFilterHasMedia] = useState(false);

	const formattedPosts = useMemo(() => {
		// start with a shallow copy
		let list = [...posts];

		// search by title or content or author
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.content.toLowerCase().includes(q) ||
					p.author.toLowerCase().includes(q),
			);
		}

		// filter has media
		if (filterHasMedia) {
			list = list.filter((p) => (p.images && p.images.length > 0) || !!p.videoUrl);
		}

		// sort
		if (sortMode === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
		else if (sortMode === "oldest") list.sort((a, b) => a.createdAt - b.createdAt);
		else if (sortMode === "most_liked")
			list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));

		return list;
	}, [posts, searchQuery, sortMode, filterHasMedia]);

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
									onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
									className="min-w-0"
								/>
								<Button variant="ghost" onClick={() => setSearchQuery("")} className="ml-2">
									<Search size={16} />
								</Button>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant={sortMode === "newest" ? "outline" : "ghost"}
									onClick={() => setSortMode("newest")}
								>
									<ArrowUpDown size={14} /> Newest
								</Button>
								<Button
									variant={sortMode === "oldest" ? "outline" : "ghost"}
									onClick={() => setSortMode("oldest")}
								>
									<ArrowUpDown size={14} /> Oldest
								</Button>
								<Button
									variant={sortMode === "most_liked" ? "outline" : "ghost"}
									onClick={() => setSortMode("most_liked")}
								>
									<Star size={14} /> Most liked
								</Button>
								<Button
									variant={filterHasMedia ? "outline" : "ghost"}
									onClick={() => setFilterHasMedia((v) => !v)}
								>
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
											className="rounded-xl border border-[#e6e6e6] bg-white overflow-hidden p-4"
										>
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
										<EmptyDescription>Create the first post to get started.</EmptyDescription>
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
									onRemoveComment={(postId, commentId) => openDeleteComment(postId, commentId)}
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
				initialValue={commentSelectedPost ? `@${commentSelectedPost.author} ` : ""}
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
