"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

type UserContextValue = {
	username: string | null;
	setUsername: (name: string | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [username, setUsernameState] = useState<string | null>(() => {
		try {
			const stored = localStorage.getItem("username");
			return stored;
		} catch (e) {
			// ignore
			return null;
		}
	});

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
