"use client"

import Link from "next/link"
import { useEffect } from "react"

type AppErrorProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function AppError({ error, reset }: AppErrorProps) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#060b09] px-6 py-12 text-slate-100 antialiased">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl"
			/>
			<div className="relative w-full max-w-md text-center">
				<span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-red-300/20 bg-red-500/10 text-2xl font-black text-red-300">
					!
				</span>
				<h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
					Algo deu errado
				</h1>
				<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
					Não foi possível carregar esta página. Tente novamente — se o problema persistir, volte
					mais tarde.
				</p>
				{error.digest && (
					<p className="mx-auto mt-3 max-w-sm truncate font-mono text-xs text-slate-600">
						Erro: {error.digest}
					</p>
				)}
				<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={reset}
						className="rounded-2xl bg-emerald-400 px-6 py-3 font-extrabold text-[#06110b] transition hover:bg-emerald-300"
					>
						Tentar novamente
					</button>
					<Link
						href="/"
						className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-center font-semibold text-slate-100 transition hover:bg-white/[0.07]"
					>
						Voltar ao início
					</Link>
				</div>
			</div>
		</main>
	)
}
