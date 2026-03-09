/**
 * Mappers between API types and domain types
 * Keeps conversion logic in one place, improving maintainability
 */

import type { ApiPost } from "@/types/api";
import type { Post } from "@/app/types";

export function mapApiPostToDomain(apiPost: ApiPost): Post {
	return {
		id: String(apiPost.id),
		title: apiPost.title,
		content: apiPost.content,
		author: apiPost.username,
		createdAt: isNaN(Date.parse(apiPost.created_datetime))
			? Date.now()
			: Date.parse(apiPost.created_datetime),
		comments: [],
		images: [],
		likes: [],
		dislikes: [],
	};
}
