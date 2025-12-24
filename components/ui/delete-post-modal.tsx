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

/**
 * DeletePostModal
 *
 * Usage:
 * <DeletePostModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={async () => { await deletePost(id) }}
 *   postTitle={post.title}
 * />
 */
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
					<DialogTitle>Deletar post</DialogTitle>
					<DialogDescription>
						{postTitle
							? `Tem certeza que deseja deletar "${postTitle}"? Esta ação é permanente.`
							: "Tem certeza que deseja deletar este post? Esta ação é permanente."}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isWorking}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={isWorking}>
						{isWorking ? "Deletando..." : "Deletar"}
					</Button>
				</DialogFooter>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
