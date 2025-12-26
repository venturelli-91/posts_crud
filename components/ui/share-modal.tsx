"use client";

import * as React from "react";
import { Smile } from "lucide-react";
import { EmojiButton } from "@joeattardi/emoji-button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	title?: string;
	description?: React.ReactNode;
	onConfirm: (comment?: string) => void | Promise<void>;
	confirmLabel?: string;
};

export default function ShareModal({
	open,
	onOpenChange,
	title = "Share post",
	description,
	onConfirm,
	confirmLabel = "Share",
}: Props) {
	const [isWorking, setIsWorking] = React.useState(false);
	const [comment, setComment] = React.useState("");
	const emojiBtnRef = React.useRef<HTMLButtonElement | null>(null);

	const pickerRef = React.useRef<EmojiButton | null>(null);

	React.useEffect(() => {
		// create and attach picker only when modal is open and button exists
		if (!open) return;
		const btn = emojiBtnRef.current;
		if (!btn) return;

		if (!pickerRef.current) {
			const picker = new EmojiButton({ position: "bottom-end" });
			pickerRef.current = picker;

			// ensure picker appears above modal by bumping its z-index when shown
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				picker.on?.("show", () => {
					setTimeout(() => {
						const el =
							document.querySelector(".emoji-picker") ||
							document.querySelector(".emoji-button") ||
							document.querySelector(".picmo");
						if (el && el instanceof HTMLElement) el.style.zIndex = "99999";
					}, 0);
				});
			} catch (e) {
				// ignore
			}

			// handle selected emoji
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			picker.on("emoji", (selection: any) => {
				const emoji = selection.emoji ?? selection;
				const ta = document.getElementById(
					"share-comment"
				) as HTMLTextAreaElement | null;
				if (!ta) {
					setComment((c) => c + emoji);
					return;
				}
				const start = ta.selectionStart ?? ta.value.length;
				const end = ta.selectionEnd ?? start;
				const next = ta.value.slice(0, start) + emoji + ta.value.slice(end);
				setComment(next);
				requestAnimationFrame(() => {
					const pos = start + emoji.length;
					ta.focus();
					ta.setSelectionRange(pos, pos);
				});
			});
		}

		const picker = pickerRef.current;
		const show = () => {
			picker.showPicker(btn);
			// fallback: after showing, ensure picker is above modal
			setTimeout(() => {
				const el =
					(document.querySelector(
						".emoji-picker, .emoji-button, .picmo, [data-emoji-picker]"
					) as HTMLElement | null) || null;
				if (el) {
					el.style.zIndex = "99999";
					if (!el.style.position) el.style.position = "absolute";
					el.style.pointerEvents = "auto";
				}
			}, 20);
		};

		btn.addEventListener("click", show);

		return () => {
			btn.removeEventListener("click", show);
			// do not destroy picker to allow reuse; keep it in ref
		};
	}, [open]);

	const handleConfirm = async () => {
		try {
			setIsWorking(true);
			await onConfirm(comment || undefined);
			onOpenChange(false);
			setComment("");
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

				<div className="mt-4 relative">
					<label className="block text-sm font-medium text-[#333] mb-2">
						Add a comment
					</label>
					<Textarea
						id="share-comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Share your opinion about this post..."
						rows={4}
						className="pr-10 resize-none max-h-44 overflow-auto"
					/>
					<button
						type="button"
						ref={emojiBtnRef}
						className="absolute bottom-2 right-2 p-1 rounded hover:bg-gray-100"
						aria-label="Add emoji">
						<Smile
							size={18}
							className="text-gray-500"
						/>
					</button>
				</div>

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
