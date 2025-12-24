"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserProvider } from "./components/signup/UserProvider";
import SignupModal from "./components/signup/SignupModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Empty } from "@/components/ui/empty";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Trash2, Edit3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
};

export default function HomePage() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [currentUser, setCurrentUser] = useState<string | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem("username");
			setCurrentUser(stored);
		} catch (e) {
			setCurrentUser(null);
		}
	}, []);

	const [posts, setPosts] = useState<Post[]>(() => {
		return [
			{
				id: "1",
				title: "My First Post at CodeLeap Network!",
				content:
					"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
				author: "Victor",
				createdAt: Date.now() - 1000 * 60 * 25,
			},
			{
				id: "2",
				title: "My Second Post at CodeLeap Network!",
				content:
					"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
				author: "Vini",
				createdAt: Date.now() - 1000 * 60 * 45,
			},
		];
	});

	function createPost() {
		if (!title.trim() || !content.trim()) return;
		const newPost: Post = {
			id: String(Date.now()),
			title: title.trim(),
			content: content.trim(),
			author: currentUser ?? "Anonymous",
			createdAt: Date.now(),
		};
		setPosts((s) => [newPost, ...s]);
		setTitle("");
		setContent("");
	}

	function removePost(id: string) {
		setPosts((s) => s.filter((p) => p.id !== id));
	}

	const formattedPosts = useMemo(() => posts, [posts]);

	return (
		<UserProvider>
			<main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
				<div className="w-full max-w-2xl">
					<header className="bg-indigo-400 rounded-t-md p-4 text-white mb-4">
						<h2 className="font-semibold">CodeLeap Network</h2>
					</header>

					<section className="bg-white rounded-md border p-4 mb-6">
						<h3 className="font-semibold text-lg mb-3">What's on your mind?</h3>
						<label className="text-sm text-muted-foreground">Title</label>
						<Input
							placeholder="Hello world"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<label className="text-sm text-muted-foreground mt-3 block">
							Content
						</label>
						<Textarea
							placeholder="Content here"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
						<div className="flex justify-end mt-3">
							<Button
								onClick={createPost}
								disabled={!title.trim() || !content.trim()}>
								Create
							</Button>
						</div>
					</section>

					<section className="space-y-4">
						{formattedPosts.length === 0 ? (
							<Empty>
								<div className="text-lg font-medium">No posts yet</div>
								<div className="text-sm text-muted-foreground">
									Create the first post to get started.
								</div>
							</Empty>
						) : (
							formattedPosts.map((post) => (
								<article
									key={post.id}
									className="border rounded-md overflow-hidden bg-white">
									<div className="flex items-center justify-between bg-indigo-400 text-white p-3">
										<h4 className="font-semibold">{post.title}</h4>
										<div className="flex items-center gap-2">
											{currentUser === post.author && (
												<>
													<Tooltip>
														<TooltipTrigger asChild>
															<button className="bg-indigo-600/30 p-1 rounded-md">
																<Edit3 size={16} />
															</button>
														</TooltipTrigger>
														<TooltipContent sideOffset={4}>Edit</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<button
																onClick={() => removePost(post.id)}
																className="bg-indigo-600/30 p-1 rounded-md">
																<Trash2 size={16} />
															</button>
														</TooltipTrigger>
														<TooltipContent sideOffset={4}>
															Delete
														</TooltipContent>
													</Tooltip>
												</>
											)}
										</div>
									</div>

									<div className="p-4">
										<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
											<div>@{post.author}</div>
											<div>
												{Math.round((Date.now() - post.createdAt) / 60000)}{" "}
												minutes ago
											</div>
										</div>
										<p className="text-sm text-neutral-800">{post.content}</p>
									</div>
								</article>
							))
						)}
					</section>
				</div>
			</main>
			<SignupModal />
		</UserProvider>
	);
}
