"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/app/types";

type SortMode = "newest" | "oldest" | "most_liked";

export function usePostFilters(posts: Post[]) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<SortMode>("newest");
	const [filterHasMedia, setFilterHasMedia] = useState(false);

	const filteredAndSortedPosts = useMemo(() => {
		let list = [...posts];

		// Search by title, content, or author
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.content.toLowerCase().includes(q) ||
					p.author.toLowerCase().includes(q),
			);
		}

		// Filter posts with media
		if (filterHasMedia) {
			list = list.filter(
				(p) => (p.images && p.images.length > 0) || !!p.videoUrl,
			);
		}

		// Sort
		if (sortMode === "newest") {
			list.sort((a, b) => b.createdAt - a.createdAt);
		} else if (sortMode === "oldest") {
			list.sort((a, b) => a.createdAt - b.createdAt);
		} else if (sortMode === "most_liked") {
			list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
		}

		return list;
	}, [posts, searchQuery, sortMode, filterHasMedia]);

	const clearSearch = () => setSearchQuery("");
	const resetFilters = () => {
		setSearchQuery("");
		setSortMode("newest");
		setFilterHasMedia(false);
	};

	return {
		searchQuery,
		setSearchQuery,
		sortMode,
		setSortMode,
		filterHasMedia,
		setFilterHasMedia,
		filteredAndSortedPosts,
		clearSearch,
		resetFilters,
	};
}
