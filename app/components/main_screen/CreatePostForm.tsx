"use client";

import React, { useRef, useEffect } from "react";
import { Smile } from "lucide-react";
// ...existing imports...
import { EmojiButton } from "@joeattardi/emoji-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-media";

type Props = {
	title: string;
	content: string;
	setTitle: (v: string) => void;
	setContent: (v: string) => void;
	onSubmit: () => void;
	images: string[];
	setImages: (arr: string[]) => void;
	videoUrl: string;
	setVideoUrl: (v: string) => void;
};

export default function CreatePostForm({
	title,
	content,
	setTitle,
	setContent,
	onSubmit,
	images,
	setImages,
	videoUrl,
	setVideoUrl,
}: Props) {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
	// previews use LazyImage for thumbnails

	useEffect(() => {
		const btn = emojiBtnRef.current;
		if (!btn) return;
		const picker = new EmojiButton({ position: "bottom-end" });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		picker.on("emoji", (selection: any) => {
			const emoji = selection.emoji ?? selection;
			const ta = document.getElementById(
				"content"
			) as HTMLTextAreaElement | null;
			if (!ta) {
				setContent(content + emoji);
				return;
			}
			const start = ta.selectionStart ?? ta.value.length;
			const end = ta.selectionEnd ?? start;
			const next = ta.value.slice(0, start) + emoji + ta.value.slice(end);
			setContent(next);
			requestAnimationFrame(() => {
				const pos = start + emoji.length;
				ta.focus();
				ta.setSelectionRange(pos, pos);
			});
		});

		const show = (e: Event) => picker.showPicker(btn);
		btn.addEventListener("click", show);
		return () => {
			btn.removeEventListener("click", show);
		};
	}, [setContent]);

	const handleFiles = (files: FileList | null) => {
		if (!files) return;
		const maxFiles = 6;
		const arr: string[] = [];
		const toRead = Math.min(files.length, maxFiles - images.length);
		for (let i = 0; i < toRead; i++) {
			const f = files[i];
			if (f.size > 5 * 1024 * 1024) continue; // skip >5MB
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					arr.push(reader.result);
					if (arr.length === toRead) setImages([...images, ...arr]);
				}
			};
			reader.readAsDataURL(f);
		}
	};

	const removeImage = (idx: number) =>
		setImages(images.filter((_, i) => i !== idx));

	const canSubmit = () => {
		return title.trim() || content.trim() || images.length > 0 || !!videoUrl;
	};

	return (
		<form
			className="rounded-xl border border-[#CCCCCC] bg-white p-6 shadow-sm"
			onSubmit={(e) => {
				e.preventDefault();
				if (!canSubmit()) return;
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
			<div className="relative">
				<Textarea
					id="content"
					className="h-32 resize-none pr-10"
					placeholder="Content here"
					value={content}
					onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
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

			<div className="mt-4">
				<label className="block text-sm mb-2 font-medium">
					Images (max 6, 5MB each)
				</label>
				<div className="flex items-center gap-2">
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						multiple
						onChange={(e) => handleFiles(e.target.files)}
						className="hidden"
					/>
					<button
						type="button"
						onClick={() => fileRef.current?.click()}
						className="px-3 py-1 rounded border border-transparent bg-[#7796ed] text-white text-sm">
						Choose images
					</button>
					<span className="text-sm text-[#666]">{images.length} selected</span>
				</div>

				{images.length > 0 && (
					<div className="mt-3 grid grid-cols-3 gap-2 max-h-40 overflow-auto">
						{images.map((src, i) => (
							<div
								key={i}
								className="relative">
								<LazyImage
									src={src}
									alt={`preview-${i}`}
									className="w-full h-20 object-cover rounded-md"
								/>
								<button
									type="button"
									onClick={() => removeImage(i)}
									className="absolute top-1 right-1 text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="mt-4">
				<label className="block text-sm mb-2 font-medium">
					YouTube video URL (optional)
				</label>
				<Input
					placeholder="https://www.youtube.com/watch?v=..."
					value={videoUrl}
					onChange={(e) => setVideoUrl((e.target as HTMLInputElement).value)}
				/>
			</div>

			<div className="flex justify-end mt-4">
				<Button
					type="submit"
					disabled={!canSubmit()}
					className="w-28 disabled:cursor-not-allowed"
					style={{
						background: !canSubmit() ? "#CCCCCC" : "#7695EC",
						color: "white",
					}}>
					Create
				</Button>
			</div>
		</form>
	);
}
