"use client";

import { useState } from "react";

export function useModalState<T = null>() {
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState<T | null>(null);

	const open = (initialData?: T) => {
		if (initialData !== undefined) {
			setData(initialData);
		}
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
		setData(null);
	};

	const toggle = (value: boolean, initialData?: T) => {
		if (value) {
			open(initialData);
		} else {
			close();
		}
	};

	return {
		isOpen,
		data,
		open,
		close,
		toggle,
		setData,
	};
}
