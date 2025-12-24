"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "./dialog";
import { Button } from "./button";

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	title?: string;
	description?: React.ReactNode;
	onConfirm: () => void | Promise<void>;
	confirmLabel?: string;
};

export default function ConfirmModal({
	open,
	onOpenChange,
	title = "Are you sure?",
	description,
	onConfirm,
	confirmLabel = "Confirm",
}: Props) {
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
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{description && (
					<div className="mt-2 text-sm text-muted-foreground">
						{description}
					</div>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isWorking}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={isWorking}>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
