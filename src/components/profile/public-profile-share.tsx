"use client"

import { toast } from "react-toastify"

type PublicProfileShareProps = {
	title: string
}

export function PublicProfileShare({ title }: PublicProfileShareProps) {
	async function shareProfile() {
		const url = window.location.href
		try {
			if (navigator.share) {
				await navigator.share({ title, url })
				return
			}
			await navigator.clipboard.writeText(url)
			toast.success("Link do perfil copiado.")
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return
			toast.error("Não foi possível compartilhar o perfil.")
		}
	}

	return (
		<button
			type="button"
			onClick={shareProfile}
			className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
		>
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				className="h-4 w-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
			</svg>
			Compartilhar
		</button>
	)
}
