"use client";

import UserProvider from "./components/signup/UserProvider";
import InnerApp from "./components/inner_app/InnerApp";

export default function Page() {
	return (
		<UserProvider>
			<InnerApp />
		</UserProvider>
	);
}
