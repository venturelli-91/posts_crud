"use client";

import { usePostActions } from "./usePostActions";
import { useCommentActions } from "./useCommentActions";

export function usePost(username: string | null) {
	const postActions = usePostActions(username);
	const commentActions = useCommentActions(username);

	return {
		...postActions,
		...commentActions,
	};
}
