export interface CreatePostPayload {
	username: string;
	title: string;
	content: string;
}

export interface UpdatePostPayload {
	id: number | string;
	data: { title?: string; content?: string };
}

export interface Post {
	id: number | string;
	username: string;
	created_datetime: string;
	title: string;
	content: string;
	// add other fields as needed
}
