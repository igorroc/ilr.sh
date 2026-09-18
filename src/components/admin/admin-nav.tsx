import Link from "next/link"

export function AdminNav() {
	return (
		<nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
			<Link href="/admin" className="text-xl font-black text-white">
				ilr.sh
			</Link>
			<div className="flex flex-wrap gap-2 text-sm font-medium text-slate-200">
				<Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/10">
					Links
				</Link>
				<Link href="/admin/page" className="rounded-lg px-3 py-2 hover:bg-white/10">
					Minha página
				</Link>
				<Link href="/admin/profile" className="rounded-lg px-3 py-2 hover:bg-white/10">
					Meu perfil
				</Link>
				<Link href="/auth/logout" className="rounded-lg px-3 py-2 text-red-200 hover:bg-red-500/10">
					Sair
				</Link>
			</div>
		</nav>
	)
}
