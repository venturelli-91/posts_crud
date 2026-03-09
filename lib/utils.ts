import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isOwner(author: string | null | undefined, username: string | null | undefined) {
	return !!author && !!username && author === username;
}

export function minutesAgo(createdAt: number, now = Date.now()) {
	return Math.round((now - createdAt) / 60000);
}
