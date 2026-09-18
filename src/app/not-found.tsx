import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Página não encontrada",
	robots: { index: false, follow: false },
}

export default function NotFound() {
	return (
		<main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#060b09] px-6 py-12 text-slate-100 antialiased">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
			/>
			<div className="relative w-full max-w-md text-center">
				<Link href="/" aria-label="ilr.sh — início" className="inline-flex items-center gap-2">
					<span className="grid h-8 w-8 place-items-center rounded-[10px] bg-emerald-400 text-base font-black text-[#06110b] italic">
						il
					</span>
					<span className="text-[19px] font-extrabold tracking-tight text-white">ilr.sh</span>
				</Link>
				<p className="mt-8 text-7xl font-black tracking-tight text-white sm:text-8xl">
					4<span className="text-emerald-400">0</span>4
				</p>
				<h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
					Página não encontrada
				</h1>
				<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
					O link que você tentou abrir não existe, foi movido ou está pausado. Confira o endereço ou
					volte ao início.
				</p>
				<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/"
						className="rounded-2xl bg-emerald-400 px-6 py-3 text-center font-extrabold text-[#06110b] transition hover:bg-emerald-300"
					>
						Voltar ao início
					</Link>
					<Link
						href="/admin"
						className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-center font-semibold text-slate-100 transition hover:bg-white/[0.07]"
					>
						Abrir painel
					</Link>
				</div>
			</div>
		</main>
	)
}
