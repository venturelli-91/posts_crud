"use client";

import React, { useState } from "react";
import { LazyImage, LazyIframe } from "@/components/ui/lazy-media";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import {
	Trash2,
	Edit3,
	ThumbsUp,
	ThumbsDown,
	Share2,
	XIcon,
} from "lucide-react";
import useStore from "@/store/useStore";
import ShareModal from "@/components/ui/share-modal";
import {
	Dialog,
	DialogContent,
	DialogPortal,
	DialogOverlay,
	DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { minutesAgo } from "@/utils";
import type { PostItemProps } from "@/app/types/index";

export default function PostItem({
	post,
	username,
	onOpenComment,
	onEditPost,
	onDeletePost,
	onStartEditComment,
	onRemoveComment,
}: PostItemProps) {
	const mins = minutesAgo(post.createdAt);
	const toggleLike = useStore((s) => s.toggleLikeComment);
	const toggleDislike = useStore((s) => s.toggleDislikeComment);
	const toggleLikePost = useStore((s) => s.toggleLikePost);
	const toggleDislikePost = useStore((s) => s.toggleDislikePost);
	const resharePost = useStore((s) => s.resharePost);
	const [shareOpen, setShareOpen] = useState(false);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

	const handleConfirmReshare = async (comment?: string) => {
		try {
			resharePost(post.id, username, comment);
			toast.success("Post reshared");
		} catch (e) {
			toast.error("Could not reshare post");
		}
	};

	const embedUrl = (() => {
		const url = post.videoUrl || "";
		if (url.includes("youtube.com/watch?v="))
			return url.replace("watch?v=", "embed/");
		if (url.includes("youtu.be/"))
			return url.replace("youtu.be/", "www.youtube.com/embed/");
		return url;
	})();

	return (
		<>
			<article className="relative rounded-xl border border-[#e6e6e6] bg-white overflow-hidden">
				<div className="flex items-center justify-between bg-[#7695EC] px-6 py-3">
					<h4 className="font-bold text-lg leading-tight text-white truncate max-w-[72%]">
						{post.title}
					</h4>

					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									aria-label="Comment"
									title="Comment"
									onClick={onOpenComment}
									className="w-8 h-8 rounded-md flex items-center justify-center border border-transparent text-white hover:bg-slate-50/10">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
								</button>
							</TooltipTrigger>
							<TooltipContent sideOffset={4}>Comments</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<button
									aria-label="Like post"
									title="Like"
									onClick={() => {
										if (!username) {
											toast("Please sign in to like posts");
											return;
										}
										toggleLikePost(post.id, username);
									}}
									className="flex items-center gap-1 px-2 h-8 rounded-md border border-transparent text-white hover:bg-slate-50/10">
									<ThumbsUp
										size={18}
										className={
											post.likes && username && post.likes.includes(username)
												? "text-[#1e293b]"
												: "text-white"
										}
									/>
									<span className="text-sm text-white">
										{post.likes?.length ?? 0}
									</span>
								</button>
							</TooltipTrigger>
							<TooltipContent sideOffset={4}>Like post</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<button
									aria-label="Dislike post"
									title="Dislike"
									onClick={() => {
										if (!username) {
											toast("Please sign in to dislike posts");
											return;
										}
										toggleDislikePost(post.id, username);
									}}
									className="flex items-center gap-1 px-2 h-8 rounded-md border border-transparent text-white hover:bg-slate-50/10">
									<ThumbsDown
										size={18}
										className={
											post.dislikes &&
											username &&
											post.dislikes.includes(username)
												? "text-red-500"
												: "text-white"
										}
									/>
									<span className="text-sm text-white">
										{post.dislikes?.length ?? 0}
									</span>
								</button>
							</TooltipTrigger>
							<TooltipContent sideOffset={4}>Dislike post</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<button
									aria-label="Share"
									title="Share"
									onClick={() => {
										if (!username) {
											toast("Please sign in to share");
											return;
										}
										setShareOpen(true);
									}}
									className="w-8 h-8 rounded-md flex items-center justify-center border border-transparent text-white hover:bg-slate-50/10">
									<Share2 size={18} />
								</button>
							</TooltipTrigger>
							<TooltipContent sideOffset={4}>Share</TooltipContent>
						</Tooltip>

						{username === post.author && (
							<>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											aria-label="Edit"
											title="Edit"
											onClick={onEditPost}
											className="w-8 h-8 rounded-md flex items-center justify-center border border-transparent text-white hover:bg-slate-50/10">
											<Edit3 size={18} />
										</button>
									</TooltipTrigger>
									<TooltipContent sideOffset={4}>Edit</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<button
											aria-label="Delete"
											title="Delete"
											onClick={onDeletePost}
											className="w-8 h-8 rounded-md flex items-center justify-center border border-transparent text-white hover:bg-slate-50/10">
											<Trash2 size={18} />
										</button>
									</TooltipTrigger>
									<TooltipContent sideOffset={4}>Delete</TooltipContent>
								</Tooltip>
							</>
						)}
					</div>

					{post.sharedComment && (
						<div className="absolute right-3 top-3 max-w-[40%] bg-white/90 border border-[#e6e6e6] rounded-md px-3 py-1 text-sm text-[#333] shadow-sm">
							{post.sharedComment}
						</div>
					)}
				</div>

				<div className="px-6 py-5">
					<div className="flex items-start justify-between text-sm mb-3">
						<span className="font-semibold text-[#333]">@{post.author}</span>
						<span className="text-[#999]">{mins} minutes ago</span>
					</div>

					<div className="text-base text-[#333] whitespace-pre-line leading-relaxed">
						{post.content}
					</div>

					{post.images && post.images.length > 0 && (
						<div className="mt-4 grid grid-cols-2 gap-2">
							{post.images.map((src, i) => (
								<LazyImage
									key={i}
									src={src}
									alt={`${post.title}-${i}`}
									className="w-full rounded-md object-cover max-h-48 cursor-pointer"
									onClick={() => {
										setModalImageSrc(src);
										setImageModalOpen(true);
									}}
								/>
							))}
						</div>
					)}

					{post.videoUrl && (
						<div className="mt-4 space-y-2">
							<div className="aspect-w-16 aspect-h-9">
								<LazyIframe
									src={embedUrl}
									title="video"
									className="w-full h-full rounded-md"
								/>
							</div>
							<div>
								<a
									href={post.videoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline wrap-break-word">
									{post.videoUrl}
								</a>
							</div>
						</div>
					)}

					{post.comments && post.comments.length > 0 && (
						<div className="mt-4 border-t pt-4 space-y-3">
							{post.comments.map((c) => (
								<div
									key={c.id}
									className="flex items-start justify-between text-sm text-[#444]">
									<div>
										<span className="font-semibold text-[#333]">
											@{c.author}
										</span>
										<span className="ml-2 text-[#333]">{c.text}</span>
									</div>
									<div className="flex items-center gap-2">
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													aria-label="Like"
													onClick={() => toggleLike(post.id, c.id, username)}
													className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-50/10">
													<ThumbsUp
														size={18}
														className={
															c.likes && username && c.likes.includes(username)
																? "text-[#0ea5e9]"
																: "text-[#7695EC]"
														}
													/>
												</button>
											</TooltipTrigger>
											<TooltipContent sideOffset={4}>{`${
												(c.likes || []).length
											} likes`}</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<button
													aria-label="Dislike"
													onClick={() => toggleDislike(post.id, c.id, username)}
													className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-50/10">
													<ThumbsDown
														size={18}
														className={
															c.dislikes &&
															username &&
															c.dislikes.includes(username)
																? "text-red-500"
																: "text-[#7695EC]"
														}
													/>
												</button>
											</TooltipTrigger>
											<TooltipContent sideOffset={4}>{`${
												(c.dislikes || []).length
											} dislikes`}</TooltipContent>
										</Tooltip>

										{username === c.author && (
											<div className="flex items-center gap-2">
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															aria-label="Edit comment"
															onClick={() =>
																onStartEditComment(post.id, c.id, c.text)
															}
															className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-50/10">
															<Edit3
																size={18}
																className="text-[#7695EC]"
															/>
														</button>
													</TooltipTrigger>
													<TooltipContent sideOffset={4}>
														Edit comment
													</TooltipContent>
												</Tooltip>

												<Tooltip>
													<TooltipTrigger asChild>
														<button
															aria-label="Delete comment"
															onClick={() =>
																onRemoveComment(post.id, c.id, c.author)
															}
															className="ml-3 w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50">
															<Trash2
																size={18}
																className="text-red-500"
															/>
														</button>
													</TooltipTrigger>
													<TooltipContent sideOffset={4}>
														Delete comment
													</TooltipContent>
												</Tooltip>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</article>
			<Dialog
				open={imageModalOpen}
				onOpenChange={setImageModalOpen}>
				{modalImageSrc && (
					<DialogPortal>
						<DialogOverlay className="z-40" />
						<DialogClose className="fixed top-4 right-4 z-9999 bg-black/80 rounded-full p-2 shadow hover:bg-black/90">
							<XIcon
								size={22}
								className="text-white"
							/>
							<span className="sr-only">Close</span>
						</DialogClose>
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
							<img
								src={modalImageSrc}
								alt="preview"
								className="max-w-[70vw] max-h-[70vh] rounded-md object-contain cursor-zoom-out"
								onClick={() => setImageModalOpen(false)}
							/>
						</div>
					</DialogPortal>
				)}
			</Dialog>
			<ShareModal
				open={shareOpen}
				onOpenChange={setShareOpen}
				title="Share post"
				description="You can add an optional comment that will appear on the reshared post."
				onConfirm={handleConfirmReshare}
				confirmLabel="Share"
			/>
		</>
	);
}
