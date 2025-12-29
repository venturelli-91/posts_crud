"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	initialValue?: string;
	onConfirm: (text: string) => void | Promise<void>;
};

export default function CommentModal({ open, onOpenChange, initialValue = "", onConfirm }: Props) {
	const [value, setValue] = React.useState(initialValue);
	const [isWorking, setIsWorking] = React.useState(false);

	React.useEffect(() => {
		if (open) setValue(initialValue ?? "");
	}, [open, initialValue]);

	const handleSave = async () => {
		if (!value.trim()) return;
		try {
			setIsWorking(true);
			await onConfirm(value.trim());
			onOpenChange(false);
		} finally {
			setIsWorking(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Write a comment</DialogTitle>
				</DialogHeader>

				<div className="mt-2">
					<label className="text-sm font-medium">Comment</label>
					<Textarea
						value={value}
						onChange={(e) => setValue((e.target as HTMLTextAreaElement).value)}
						className="h-28"
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isWorking}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isWorking || !value.trim()}>
						{isWorking ? "Posting..." : "Post comment"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
