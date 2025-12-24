"use client";

import * as React from "react";
import { Button } from "./button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "./dialog";

type DeletePostModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void> | void;
	postTitle?: string;
};

export default function DeletePostModal({
	open,
	onOpenChange,
	onConfirm,
	postTitle,
}: DeletePostModalProps) {
	const [isWorking, setIsWorking] = React.useState(false);

	const handleConfirm = async () => {
		try {
			setIsWorking(true);
			await onConfirm();
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
					<DialogTitle>Delete Post</DialogTitle>
					<DialogDescription>
						{postTitle
							? `Are you sure you want to delete "${postTitle}"? This action is permanent.`
							: "Are you sure you want to delete this post? This action is permanent."}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isWorking}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={isWorking}>
						{isWorking ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
