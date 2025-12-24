"use client";

import React, { useEffect, useState } from "react";
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
import { useUser } from "./UserProvider";

export function SignupModal() {
	const { username, setUsername } = useUser();
	const [value, setValue] = useState(() => username ?? "");

	// derive modal open state from username to avoid calling setState inside useEffect
	const open = !username;

	// debug
	useEffect(() => {
		console.debug("SignupModal state:", { username, open, value });
	}, [username, open, value]);

	function submit() {
		const trimmed = value.trim();
		if (!trimmed) return;
		setUsername(trimmed);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => console.debug("Dialog onOpenChange:", isOpen)}>
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
						aria-disabled={!value.trim()}
						className="bg-[#7796ed] text-white w-24">
						ENTER
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default SignupModal;
