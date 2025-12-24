"use client";

import UserProvider from "./components/signup/UserProvider";
import InnerApp from "./components/main_screen/InnerApp";

export default function Page() {
	return (
		<UserProvider>
			<InnerApp />
		</UserProvider>
	);
}
