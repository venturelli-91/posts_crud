const BASE = "https://dev.codeleap.co.uk/careers/";

export async function fetcher<T>(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(input, init);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`${res.status} ${res.statusText} - ${text}`);
	}
	// DELETE returns empty body
	if (res.status === 204) return null as unknown as T;
	return (await res.json()) as T;
}

export function getPostsUrl() {
	return BASE;
}

export function getPostUrl(id: number | string) {
	return `${BASE}${id}/`;
}

export async function listPosts() {
	return fetcher<unknown[]>(getPostsUrl());
}

export async function createPost(payload: {
	username: string;
	title: string;
	content: string;
}) {
	return fetcher<unknown>(getPostsUrl(), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export async function updatePost(
	id: number | string,
	payload: { title?: string; content?: string }
) {
	return fetcher<unknown>(getPostUrl(id), {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export async function deletePost(id: number | string) {
	return fetcher<void>(getPostUrl(id), { method: "DELETE" });
}
