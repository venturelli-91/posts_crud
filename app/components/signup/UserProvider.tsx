"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type UserContextValue = {
	username: string | null | undefined;
	setUsername: (name: string | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [username, setUsernameState] = useState<string | null | undefined>(
		undefined
	);

	// populate username from localStorage after mount to avoid SSR/client mismatch
	useEffect(() => {
		try {
			const stored = localStorage.getItem("username");
			setTimeout(() => setUsernameState(stored), 0);
		} catch (e) {
			setTimeout(() => setUsernameState(null), 0);
		}
	}, []);

	const setUsername = useCallback((name: string | null) => {
		setUsernameState(name);
		try {
			if (name) localStorage.setItem("username", name);
			else localStorage.removeItem("username");
		} catch (e) {
			// ignore
		}
	}, []);

	return (
		<UserContext.Provider value={{ username, setUsername }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within a UserProvider");
	return ctx;
}

export default UserProvider;
