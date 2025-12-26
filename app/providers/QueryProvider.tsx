"use client";

import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: PropsWithChildren) {
	const [qc] = useState(() => new QueryClient());
	return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
