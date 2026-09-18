"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type AdminNavProps = {
	username: string | null
	name: string
	email: string
}

function Icon({ d }: { d: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			className="h-[18px] w-[18px] shrink-0"
			aria-hidden="true"
		>
			<path d={d} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

const ICONS = {
	link: "M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3",
	bio: "M4 6h16M4 12h16M4 18h10M18 16l2 2-2 2",
	chart: "M5 20v-7m5 7V4m5 16v-11m5 11V8",
	globe: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3zM3.5 9h17M3.5 15h17",
	gear: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 00-2-1.2L14.6 3h-5.2L9 5.7a7.5 7.5 0 00-2 1.2l-2.3-1-2 3.4 2 1.5a7.4 7.4 0 000 2.4l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 002 1.2l.4 2.7h5.2l.4-2.7a7.5 7.5 0 002-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z",
}

export function AdminMobileNav() {
	const pathname = usePathname()
	const pill = (active: boolean) =>
		`shrink-0 rounded-xl px-3.5 py-2 font-medium transition ${
			active ? "bg-emerald-400/[0.14] text-emerald-200" : "bg-white/[0.03] text-slate-400"
		}`
	return (
		<nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm lg:hidden">
			<Link href="/admin" className={pill(pathname === "/admin")}>
				Links
			</Link>
			<Link href="/admin/page" className={pill(pathname.startsWith("/admin/page"))}>
				Bio page
			</Link>
			<Link href="/admin/profile" className={pill(pathname.startsWith("/admin/profile"))}>
				Configurações
			</Link>
		</nav>
	)
}

export function AdminNav({ username, name, email }: AdminNavProps) {
	const pathname = usePathname()
	const isActive = (href: string, exact = false) =>
		exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

	const itemClass = (active: boolean) =>
		`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition ${
			active
				? "bg-emerald-400/[0.14] text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
				: "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
		}`

	return (
		<aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080e0c] px-4 py-6 lg:flex">
			<Link href="/admin" className="flex items-center gap-2 px-2">
				<span className="grid h-8 w-8 place-items-center rounded-[10px] bg-emerald-400 text-base font-black text-[#06110b] italic">
					il
				</span>
				<span className="text-[19px] font-extrabold tracking-tight text-white">ilr.sh</span>
			</Link>

			<nav className="mt-8 flex flex-col gap-1.5">
				<Link href="/admin" className={itemClass(isActive("/admin", true))}>
					<Icon d={ICONS.link} />
					Links
				</Link>
				<Link href="/admin/page" className={itemClass(isActive("/admin/page"))}>
					<Icon d={ICONS.bio} />
					Bio page
				</Link>
				<span
					title="Em breve"
					className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-slate-600"
				>
					<Icon d={ICONS.chart} />
					Estatísticas
					<span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-wide text-slate-500 uppercase">
						breve
					</span>
				</span>
				<Link href="/admin/profile" className={itemClass(isActive("/admin/profile"))}>
					<Icon d={ICONS.gear} />
					Configurações
				</Link>
			</nav>

			<div className="mt-auto space-y-3">
				{username ? (
					<a
						href={`/@${username}`}
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-between rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.07] px-4 py-3 text-sm transition hover:bg-emerald-400/[0.12]"
					>
						<span>
							<span className="block text-xs text-emerald-200/70">página pública</span>
							<span className="block font-bold text-emerald-100">/@{username}</span>
						</span>
						<span aria-hidden="true" className="text-emerald-300">
							↗
						</span>
					</a>
				) : (
					<Link
						href="/admin/profile"
						className="block rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"
					>
						Defina seu username para publicar.
					</Link>
				)}
				<div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
					<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-sm font-black text-emerald-200">
						{name.charAt(0).toUpperCase()}
					</span>
					<span className="min-w-0 flex-1">
						<span className="block truncate text-sm font-semibold text-white">{name}</span>
						<span className="block truncate text-xs text-slate-500">{email}</span>
					</span>
					<Link href="/auth/logout" title="Sair" className="shrink-0 text-slate-500 hover:text-red-300">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
							<path d="M15 12H4m0 0l4-4m-4 4l4 4M10 4h9a1 1 0 011 1v14a1 1 0 01-1 1h-9" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</Link>
				</div>
			</div>
		</aside>
	)
}
