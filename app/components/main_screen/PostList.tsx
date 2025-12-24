"use client";

import React from "react";
import PostItem from "./PostItem";
import type { Post } from "@/app/types";

type Props = {
	posts: Post[];
	username: string | null;
	onOpenComment: (post: Post) => void;
	onEditPost: (post: Post) => void;
	onDeletePost: (post: Post) => void;
	onStartEditComment: (
		postId: string,
		commentId: string,
		initialText: string
	) => void;
	onRemoveComment: (
		postId: string,
		commentId: string,
		commentAuthor?: string
	) => void;
};

export default function PostList({
	posts,
	username,
	onOpenComment,
	onEditPost,
	onDeletePost,
	onStartEditComment,
	onRemoveComment,
}: Props) {
	return (
		<section className="space-y-4">
			{posts.map((p) => (
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
	);
}
