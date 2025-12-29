"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./skeleton";

type LazyImageProps = {
	src: string;
	alt?: string;
	className?: string;
	width?: number;
	height?: number;
	onClick?: () => void;
};

export function LazyImage({ src, alt = "", className, width, height, onClick }: LazyImageProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setVisible(true);
						io.disconnect();
					}
				});
			},
			{ rootMargin: "200px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const normalizedSrc = typeof src === "string" ? src.trim() : src;
	const isDataOrBlob =
		typeof normalizedSrc === "string" &&
		(normalizedSrc.toLowerCase().startsWith("data:") ||
			normalizedSrc.toLowerCase().startsWith("blob:"));

	return (
		<div
			ref={ref}
			className={className}
			onClick={onClick}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onKeyDown={(e) => {
				if (!onClick) return;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{!loaded && <Skeleton className="w-full h-full rounded-md" />}
			{visible ? (
				isDataOrBlob ? (
					<img
						src={normalizedSrc as string}
						alt={alt}
						loading="lazy"
						style={{ width: "100%", height: "auto" }}
						className={`w-full rounded-md object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
						onLoad={() => setLoaded(true)}
					/>
				) : (
					<Image
						src={normalizedSrc as string}
						alt={alt}
						loading="lazy"
						width={width}
						height={height}
						className={`w-full rounded-md object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
						onLoad={() => setLoaded(true)}
					/>
				)
			) : null}
		</div>
	);
}

type LazyIframeProps = {
	src: string;
	title?: string;
	className?: string;
};

export function LazyIframe({ src, title = "video", className }: LazyIframeProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setVisible(true);
						io.disconnect();
					}
				});
			},
			{ rootMargin: "400px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<div ref={ref} className={className}>
			{!loaded && <Skeleton className="w-full h-56 rounded-md" />}
			{visible && (
				<iframe
					src={src}
					title={title}
					loading="lazy"
					className={`w-full h-56 rounded-md ${loaded ? "opacity-100" : "opacity-0"}`}
					onLoad={() => setLoaded(true)}
					allowFullScreen
				/>
			)}
		</div>
	);
}

export default { LazyImage, LazyIframe };
