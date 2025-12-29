import { Post, CreatePostPayload, UpdatePostPayload } from "@/types/posts";

const BASE = "https://dev.codeleap.co.uk/careers/";

export async function fetcher<T>(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(input, init);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`${res.status} ${res.statusText} - ${text}`);
	}

	// No content (DELETE) or explicit 204 — map to undefined for void returns
	if (res.status === 204) return undefined as unknown as T;

	const contentType = res.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		return undefined as unknown as T;
	}

	return (await res.json()) as T;
}

export function getPostsUrl() {
	return BASE;
}

export function getPostUrl(id: number | string) {
	return `${BASE}${id}/`;
}

export async function listPosts(): Promise<Post[]> {
	const page = await fetcher<{
		count: number;
		next: string | null;
		previous: string | null;
		results: Post[];
	}>(getPostsUrl());
	return page.results || [];
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
	return fetcher<Post>(getPostsUrl(), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export async function updatePost(
	id: number | string,
	payload: UpdatePostPayload["data"],
): Promise<Post> {
	return fetcher<Post>(getPostUrl(id), {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export async function deletePost(id: number | string): Promise<void> {
	await fetcher<void>(getPostUrl(id), { method: "DELETE" });
}
