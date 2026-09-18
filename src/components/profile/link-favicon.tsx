"use client"

import { useState } from "react"

const faviconPaths = [
	"/favicon.ico",
	"/favicon.png",
	"/favicon.svg",
	"/favicon-32x32.png",
	"/favicon-16x16.png",
	"/apple-touch-icon.png",
	"/apple-touch-icon-precomposed.png",
	"/icon.png",
	"/assets/favicon.ico",
	"/images/favicon.ico",
]

type LinkFaviconProps = {
	destinationUrl: string
	title: string
}

export function LinkFavicon({ destinationUrl, title }: LinkFaviconProps) {
	const [attempt, setAttempt] = useState(0)
	let candidates: string[] = []

	try {
		const url = new URL(destinationUrl)
		const origin = url.origin
		candidates = Array.from(
			new Set(
				[
					`https://a.favicon.im/${encodeURIComponent(url.hostname)}?larger=true`,
					...faviconPaths.map((path) => `${origin}${path}`),
				].filter((candidate): candidate is string => Boolean(candidate)),
			),
		)
	} catch {
		return <FallbackIcon title={title} />
	}

	if (!candidates[attempt]) return <FallbackIcon title={title} />

	return (
		<>
			{/* a.favicon.im resolves the site's declared favicon; common paths remain client-side fallbacks. */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={candidates[attempt]}
				alt=""
				className="h-full w-full object-contain"
				onError={() => setAttempt((current) => current + 1)}
			/>
		</>
	)
}

function FallbackIcon({ title }: { title: string }) {
	return <span className="text-sm font-black text-slate-500">{title.charAt(0).toUpperCase()}</span>
}
