"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "./dialog";

type EditPostModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (data: { title: string; content: string }) => Promise<void> | void;
	postTitle?: string;
	postContent?: string;
};

export default function EditPostModal({
	open,
	onOpenChange,
	onConfirm,
	postTitle,
	postContent,
}: EditPostModalProps) {
	const [title, setTitle] = React.useState(postTitle ?? "");
	const [content, setContent] = React.useState(postContent ?? "");
	const [isWorking, setIsWorking] = React.useState(false);

	React.useEffect(() => {
		if (open) {
			setTitle(postTitle ?? "");
			setContent(postContent ?? "");
		}
	}, [open, postTitle, postContent]);

	const handleSave = async () => {
		try {
			setIsWorking(true);
			await onConfirm({ title: title.trim(), content: content.trim() });
			onOpenChange(false);
		} finally {
			setIsWorking(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Post</DialogTitle>
					<DialogDescription>
						Edit the post title and content.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-2">
					<label className="text-sm font-medium">Title</label>
					<Input
						value={title}
						onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
					/>

					<label className="text-sm font-medium mt-2">Content</label>
					<Textarea
						value={content}
						onChange={(e) =>
							setContent((e.target as HTMLTextAreaElement).value)
						}
					/>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isWorking}>
						Cancel
					</Button>
					<Button
						variant="default"
						onClick={handleSave}
						className="bg-emerald-500 hover:bg-emerald-600 text-white"
						disabled={isWorking || !title.trim() || !content.trim()}>
						{isWorking ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>

				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
