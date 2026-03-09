/**
 * API response types - these match the backend response format
 */

export interface ApiPost {
	id: number | string;
	username: string;
	title: string;
	content: string;
	created_datetime: string;
}

export interface ApiCreatePostPayload {
	username: string;
	title: string;
	content: string;
}

export interface ApiUpdatePostPayload {
	id: number | string;
	data: { title?: string; content?: string };
}

export interface ApiListResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}
