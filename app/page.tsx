"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import UserProvider, { useUser } from "./components/signup/UserProvider";
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

type Post = {
	id: string;
	title: string;
	content: string;
	author: string;
	createdAt: number;
};

function InnerApp() {
	const { username } = useUser();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [posts, setPosts] = useState<Post[]>(() => [
		{
			id: "1",
			title: "My First Post at CodeLeap Network!",
			content:
				"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel sem. Nullam cursus lacinia erat.",
			author: "Victor",
			createdAt: Date.now() - 1000 * 60 * 25,
		},
		{
			id: "2",
			title: "My Second Post at CodeLeap Network!",
			content:
				"Curabitur suscipit suscipit tellus. Phasellus consectetur vestibulum elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\nDuis lobortis massa imperdiet quam. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Fusce a quam. Nullam vel sem. Nullam cursus lacinia erat.",
			author: "Vini",
			createdAt: Date.now() - 1000 * 60 * 45,
		},
	]);

	function createPost() {
		if (!title.trim() || !content.trim()) return;
		const newPost: Post = {
			id: String(Date.now()),
			title: title.trim(),
			content: content.trim(),
			author: username ?? "Anonymous",
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

	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 60000);
		return () => clearInterval(interval);
	}, []);

	// show only signup modal (centered) when no username
	if (!username) {
		return (
			<div className="min-h-screen bg-[#DDDDDD] flex items-center justify-center px-4">
				<SignupModal />
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-[#DDDDDD] flex flex-col items-center py-6 px-4">
			<div className="w-full max-w-205">
				<div className="bg-white rounded-xl border border-[#e6e6e6] overflow-hidden">
					<header className="bg-[#7695EC] px-6 py-4 text-white">
						<h2 className="font-semibold">CodeLeap Network</h2>
					</header>

					<div className="p-6">
						<section className="mb-6">
							<form
								className="rounded-xl border border-[#CCCCCC] bg-white p-6 shadow-sm"
								onSubmit={(e) => {
									e.preventDefault();
									createPost();
								}}>
								<h3 className="font-bold text-lg mb-4">
									What&#39;s on your mind?
								</h3>

								<label
									className="block text-sm mb-1 font-medium"
									htmlFor="title">
									Title
								</label>
								<Input
									id="title"
									placeholder="Hello world"
									value={title}
									onChange={(e) =>
										setTitle((e.target as HTMLInputElement).value)
									}
								/>

								<label
									className="block text-sm mt-4 mb-1 font-medium"
									htmlFor="content">
									Content
								</label>
								<Textarea
									id="content"
									placeholder="Content here"
									value={content}
									onChange={(e) =>
										setContent((e.target as HTMLTextAreaElement).value)
									}
								/>

								<div className="flex justify-end mt-4">
									<Button
										type="submit"
										disabled={!title.trim() || !content.trim()}
										className="w-28 disabled:cursor-not-allowed"
										style={{
											background:
												!title.trim() || !content.trim()
													? "#CCCCCC"
													: "#7695EC",
											color: "white",
										}}>
										Create
									</Button>
								</div>
							</form>
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
								formattedPosts.map((post) => {
									const mins = Math.round((now - post.createdAt) / 60000);
									return (
										<article
											key={post.id}
											className="rounded-xl border border-[#e6e6e6] bg-white overflow-hidden">
											<div className="flex items-center justify-between bg-[#7695EC] px-6 py-3">
												<h4 className="font-bold text-lg leading-tight text-white truncate max-w-[72%]">
													{post.title}
												</h4>

												<div className="flex items-center gap-2">
													{username === post.author && (
														<>
															<Tooltip>
																<TooltipTrigger asChild>
																	<button
																		aria-label="Edit"
																		title="Edit"
																		className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#7695EC] shadow-sm">
																		<Edit3 size={14} />
																	</button>
																</TooltipTrigger>
																<TooltipContent sideOffset={4}>
																	Edit
																</TooltipContent>
															</Tooltip>

															<Tooltip>
																<TooltipTrigger asChild>
																	<button
																		aria-label="Delete"
																		title="Delete"
																		onClick={() => removePost(post.id)}
																		className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#7695EC] shadow-sm">
																		<Trash2 size={14} />
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

											<div className="px-6 py-5">
												<div className="flex items-start justify-between text-sm mb-3">
													<span className="font-semibold text-[#333]">
														@{post.author}
													</span>
													<span className="text-[#999]">
														{mins} minutes ago
													</span>
												</div>

												<div className="text-base text-[#333] whitespace-pre-line leading-relaxed">
													{post.content}
												</div>
											</div>
										</article>
									);
								})
							)}
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function Page() {
	return (
		<UserProvider>
			<InnerApp />
		</UserProvider>
	);
}
