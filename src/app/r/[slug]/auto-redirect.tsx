"use client"

import { useEffect } from "react"

type AutoRedirectProps = {
	url: string
	label: string
}

export function AutoRedirect({ url, label }: AutoRedirectProps) {
	useEffect(() => {
		window.location.replace(url)
	}, [url])

	return (
		<main className="grid min-h-dvh place-items-center bg-[#060b09] px-6 text-center text-slate-100">
			<div className="max-w-sm space-y-4">
				<span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-xl font-black text-[#06110b] italic">
					il
				</span>
				<p className="text-lg font-bold text-white">Redirecionando para {label}…</p>
				<p className="text-sm text-slate-400">
					Se nada acontecer,{" "}
					<a href={url} className="font-semibold text-emerald-300 hover:underline">
						clique aqui para abrir o link
					</a>
					.
				</p>
			</div>
		</main>
	)
}
