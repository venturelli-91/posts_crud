"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
	title: string;
	content: string;
	setTitle: (v: string) => void;
	setContent: (v: string) => void;
	onSubmit: () => void;
};

export default function CreatePostForm({
	title,
	content,
	setTitle,
	setContent,
	onSubmit,
}: Props) {
	return (
		<form
			className="rounded-xl border border-[#CCCCCC] bg-white p-6 shadow-sm"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}>
			<h3 className="font-bold text-lg mb-4">What&apos;s on your mind?</h3>

			<label
				className="block text-sm mb-1 font-medium"
				htmlFor="title">
				Title
			</label>
			<Input
				id="title"
				placeholder="Hello world"
				value={title}
				onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
			/>

			<label
				className="block text-sm mt-4 mb-1 font-medium"
				htmlFor="content">
				Content
			</label>
			<Textarea
				id="content"
				className="h-32 resize-none"
				placeholder="Content here"
				value={content}
				onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
			/>

			<div className="flex justify-end mt-4">
				<Button
					type="submit"
					disabled={!title.trim() || !content.trim()}
					className="w-28 disabled:cursor-not-allowed"
					style={{
						background:
							!title.trim() || !content.trim() ? "#CCCCCC" : "#7695EC",
						color: "white",
					}}>
					Create
				</Button>
			</div>
		</form>
	);
}
