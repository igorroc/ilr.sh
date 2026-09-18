import Link from "next/link"

import { AuthSession } from "@/modules/auth"
import { AdminMobileNav, AdminNav } from "@/components/admin/admin-nav"

export const metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const user = await AuthSession.requireUser()

	return (
		<div className="relative min-h-dvh bg-[#060b09] text-slate-100 antialiased">
			{/* identidade: linha neon + glows verdes como na referência */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
			<div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
			<div aria-hidden="true" className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-emerald-500/[0.07] blur-3xl" />

			<div className="relative mx-auto flex min-h-dvh w-full max-w-[1400px]">
				<AdminNav username={user.username} name={user.name} email={user.email} />
				<div className="min-w-0 flex-1">
					{/* topo mobile */}
					<div className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#060b09]/90 px-4 py-3 backdrop-blur-md lg:hidden">
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-2 text-lg font-black tracking-tight">
								<span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400 text-sm font-black text-[#06110b] italic">
									il
								</span>
								ilr.sh
							</span>
							<Link
								href="/auth/logout"
								className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300"
							>
								Sair
							</Link>
						</div>
						<AdminMobileNav />
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
