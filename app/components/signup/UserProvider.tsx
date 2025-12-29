"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type UserContextValue = {
	username: string | null | undefined;
	setUsername: (name: string | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [username, setUsernameState] = useState<string | null>(null);

	const setUsername = useCallback((name: string | null) => {
		setUsernameState(name);
	}, []);

	return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within a UserProvider");
	return ctx;
}

export default UserProvider;
