"use client";

import { useState } from "react";

export function usePostForm() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [videoUrl, setVideoUrl] = useState("");

	const reset = () => {
		setTitle("");
		setContent("");
		setImages([]);
		setVideoUrl("");
	};

	const isEmpty = () =>
		!title.trim() && !content.trim() && images.length === 0 && !videoUrl;

	return {
		title,
		setTitle,
		content,
		setContent,
		images,
		setImages,
		videoUrl,
		setVideoUrl,
		reset,
		isEmpty,
	};
}
