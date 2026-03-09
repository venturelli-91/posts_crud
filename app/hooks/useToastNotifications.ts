"use client";

import React from "react";
import { toast } from "sonner";

type ToastType = "success" | "error";

function createToastContent(message: string, type: ToastType) {
	const bgColor = type === "success" ? "#16a34a" : "#ef4444";
	return {
		description: React.createElement(
			"span",
			{ className: "text-white" },
			message,
		),
		style: { background: bgColor, color: "#ffffff" },
		className: "text-white",
	};
}

export function useToastNotifications() {
	const showSuccess = (title: string, message: string) => {
		toast.success(title, createToastContent(message, "success"));
	};

	const showError = (title: string, message: string) => {
		toast.error(title, createToastContent(message, "error"));
	};

	return { showSuccess, showError };
}
