"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "react-toastify"

import { deleteLinkAction, setLinkActiveAction } from "@/app/admin/actions"
import { NewLinkModal } from "@/components/admin/new-link-modal"

export type AdminLinkItem = {
	id: string
	title: string | null
	slug: string
	destinationUrl: string
	isActive: boolean
	createdAt: string
}

type LinksManagerProps = {
	links: AdminLinkItem[]
	origin: string
	shortHost: string
}

function LinkGlyph() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
			<path d="M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function LinkCard({ link, shortUrl }: { link: AdminLinkItem; shortUrl: string }) {
	async function copy() {
		try {
			await navigator.clipboard.writeText(shortUrl)
			toast.success("Link copiado.")
		} catch {
			toast.error("Não foi possível copiar.")
		}
	}

	async function toggle() {
		await setLinkActiveAction(link.id, !link.isActive)
	}

	async function remove() {
		if (!window.confirm(`Excluir “${link.title || link.slug}”?`)) return
		await deleteLinkAction(link.id)
	}

	return (
		<article className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#101614]/90 px-4 py-4 transition hover:border-emerald-300/25 sm:px-5">
			<span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${link.isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.05] text-slate-500"}`}>
				<LinkGlyph />
			</span>

			<div className="min-w-0 flex-1">
				<p className="truncate text-[15px] font-bold text-white">
					{link.title || link.slug}
					{!link.isActive && (
						<span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
							pausado
						</span>
					)}
				</p>
				<div className="mt-0.5 flex min-w-0 items-center gap-1.5">
					<a
						href={`/r/${link.slug}`}
						target="_blank"
						rel="noreferrer"
						className="truncate text-[13px] font-medium text-emerald-300/90 hover:text-emerald-200 hover:underline"
					>
						{shortUrl.replace(/^https?:\/\//, "")}
					</a>
					<button
						type="button"
						onClick={copy}
						title="Copiar link curto"
						className="shrink-0 rounded-md p-1 text-emerald-200/60 transition hover:bg-emerald-400/10 hover:text-emerald-200"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
							<rect x="9" y="9" width="11" height="11" rx="2" />
							<path d="M5 15V5a1 1 0 011-1h10" strokeLinecap="round" />
						</svg>
					</button>
				</div>
				<p className="mt-1 truncate text-xs text-slate-500">{link.destinationUrl}</p>
			</div>

			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<span className="mr-1 hidden text-right sm:block">
					<span className={`block text-[13px] font-bold ${link.isActive ? "text-white" : "text-slate-500"}`}>
						{link.isActive ? "Ativo" : "Inativo"}
					</span>
					<span className="block text-[11px] text-slate-500">
						{new Date(link.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
					</span>
				</span>
				{/* barras decorativas de status — mesma linguagem da referência, sem fingir analytics */}
				<span aria-hidden="true" className="mr-1 hidden items-end gap-[3px] sm:flex">
					{[6, 12, 9, 15, 11].map((h, i) => (
						<span
							key={i}
							style={{ height: `${h}px` }}
							className={`w-[3px] rounded-full ${link.isActive ? "bg-emerald-400/80" : "bg-white/10"}`}
						/>
					))}
				</span>
				<details className="relative">
					<summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white [&::-webkit-details-marker]:hidden">
						<span aria-hidden="true" className="text-lg leading-none tracking-widest">⋮</span>
						<span className="sr-only">Ações do link</span>
					</summary>
					<div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0c1210] p-1.5 shadow-2xl">
						<Link
							href={`/admin/links/${link.id}`}
							className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]"
						>
							Editar
						</Link>
						<button
							type="button"
							onClick={copy}
							className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/[0.06]"
						>
							Copiar URL curta
						</button>
						<form action={toggle}>
							<button className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/[0.06]">
								{link.isActive ? "Desativar" : "Ativar"}
							</button>
						</form>
						<form action={remove}>
							<button className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10">
								Excluir
							</button>
						</form>
					</div>
				</details>
			</div>
		</article>
	)
}

export function LinksManager({ links, origin, shortHost }: LinksManagerProps) {
	const [query, setQuery] = useState("")

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return links
		return links.filter((link) =>
			[link.title ?? "", link.slug, link.destinationUrl].join(" ").toLowerCase().includes(q),
		)
	}, [links, query])

	return (
		<div>
			<div className="flex flex-wrap items-center gap-3">
				<h1 className="text-[26px] font-extrabold tracking-tight text-white">Meus links</h1>
				<div className="ml-auto flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
					<label className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
						<span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-500">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
								<circle cx="11" cy="11" r="7" />
								<path d="M20 20l-3.5-3.5" strokeLinecap="round" />
							</svg>
						</span>
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Buscar links..."
							className="w-full rounded-xl border border-white/10 bg-[#101614] py-2.5 pr-3 pl-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-400/15"
						/>
					</label>
					<NewLinkModal />
				</div>
			</div>

			<p className="mt-2 text-sm text-slate-500">
				{origin.replace(/^https?:\/\//, "")} · {links.length} {links.length === 1 ? "link" : "links"}
				{query && ` · ${filtered.length} encontrados`}
			</p>

			<div className="mt-5 space-y-3">
				{filtered.map((link) => (
					<LinkCard key={link.id} link={link} shortUrl={`${shortHost}/${link.slug}`} />
				))}
				{!filtered.length && (
					<div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
						<p className="font-bold text-white">{query ? "Nada encontrado." : "Você ainda não criou links."}</p>
						<p className="mt-1 text-sm text-slate-400">
							{query ? "Tente outro termo de busca." : "Crie seu primeiro link curto com o botão acima."}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
