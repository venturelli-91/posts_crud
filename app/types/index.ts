export type Comment = {
	id: string;
	author: string;
	text: string;
	createdAt: number;
	likes?: string[];
	dislikes?: string[];
};

export type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
	comments?: Comment[];
	likes?: string[];
	dislikes?: string[];
	images?: string[];
	videoUrl?: string;
	sharedComment?: string;
};
