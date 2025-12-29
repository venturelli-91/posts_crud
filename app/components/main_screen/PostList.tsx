"use client";

import React, { useMemo, useState } from "react";
import PostItem from "./PostItem";
import type { Post } from "@/app/types";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";

type Props = {
	posts: Post[];
	username: string | null;
	onOpenComment: (post: Post) => void;
	onEditPost: (post: Post) => void;
	onDeletePost: (post: Post) => void;
	onStartEditComment: (postId: string, commentId: string, initialText: string) => void;
	onRemoveComment: (postId: string, commentId: string, commentAuthor?: string) => void;
	pageSize?: number;
};

export default function PostList({
	posts,
	username,
	onOpenComment,
	onEditPost,
	onDeletePost,
	onStartEditComment,
	onRemoveComment,
	pageSize = 5,
}: Props) {
	const [page, setPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));

	const current = useMemo(() => {
		const start = (page - 1) * pageSize;
		return posts.slice(start, start + pageSize);
	}, [posts, page, pageSize]);

	function goTo(p: number) {
		const next = Math.min(Math.max(1, p), totalPages);
		setPage(next);
	}

	return (
		<>
			<section className="space-y-4">
				{current.map((p) => (
					<PostItem
						key={p.id}
						post={p}
						username={username}
						onOpenComment={() => onOpenComment(p)}
						onEditPost={() => onEditPost(p)}
						onDeletePost={() => onDeletePost(p)}
						onStartEditComment={onStartEditComment}
						onRemoveComment={onRemoveComment}
					/>
				))}
			</section>

			<div className="mt-6 hover:pointer">
				<Pagination>
					<PaginationPrevious onClick={() => goTo(page - 1)} />
					<PaginationContent>
						{Array.from({ length: totalPages }).map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink isActive={i + 1 === page} onClick={() => goTo(i + 1)}>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}
					</PaginationContent>
					<PaginationNext onClick={() => goTo(page + 1)} />
				</Pagination>
			</div>
		</>
	);
}
