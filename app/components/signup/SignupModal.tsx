"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/store/useStore";

export default function SignupModal() {
	const username = useStore((s: { username: string | null }) => s.username);
	const setUsername = useStore(
		(s: { setUsername: (username: string) => void }) => s.setUsername
	);
	const [value, setValue] = useState(username ?? "");

	const open = !username;

	function submit() {
		const trimmed = value.trim();
		if (!trimmed) return;
		setUsername(trimmed);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={() => {}}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Welcome to CodeLeap network!</DialogTitle>
					<DialogDescription>Please enter your username</DialogDescription>
				</DialogHeader>

				<div className="mt-2">
					<Input
						placeholder="John doe"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						aria-label="username"
					/>
				</div>

				<DialogFooter>
					<Button
						onClick={submit}
						disabled={!value.trim()}
						aria-disabled={!value.trim()}>
						ENTER
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
