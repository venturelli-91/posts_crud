"use client";

import React from "react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Trash2, Edit3 } from "lucide-react";
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

	return (
		<article className="rounded-xl border border-[#e6e6e6] bg-white overflow-hidden">
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
								className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#7695EC] shadow-sm">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#7695EC"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round">
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
								</svg>
							</button>
						</TooltipTrigger>
						<TooltipContent sideOffset={4}>Comments</TooltipContent>
					</Tooltip>

					{username === post.author && (
						<>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										aria-label="Edit"
										title="Edit"
										onClick={onEditPost}
										className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#7695EC] shadow-sm">
										<Edit3 size={14} />
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
										className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#7695EC] shadow-sm">
										<Trash2 size={14} />
									</button>
								</TooltipTrigger>
								<TooltipContent sideOffset={4}>Delete</TooltipContent>
							</Tooltip>
						</>
					)}
				</div>
			</div>

			<div className="px-6 py-5">
				<div className="flex items-start justify-between text-sm mb-3">
					<span className="font-semibold text-[#333]">@{post.author}</span>
					<span className="text-[#999]">{mins} minutes ago</span>
				</div>

				<div className="text-base text-[#333] whitespace-pre-line leading-relaxed">
					{post.content}
				</div>

				{post.comments && post.comments.length > 0 && (
					<div className="mt-4 border-t pt-4 space-y-3">
						{post.comments.map((c) => (
							<div
								key={c.id}
								className="flex items-start justify-between text-sm text-[#444]">
								<div>
									<span className="font-semibold text-[#333]">@{c.author}</span>
									<span className="ml-2 text-[#333]">{c.text}</span>
								</div>
								{username === c.author && (
									<div className="flex items-center gap-2">
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													aria-label="Edit comment"
													onClick={() =>
														onStartEditComment(post.id, c.id, c.text)
													}
													className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-50">
													<Edit3
														size={14}
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
														size={14}
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
						))}
					</div>
				)}
			</div>
		</article>
	);
}
