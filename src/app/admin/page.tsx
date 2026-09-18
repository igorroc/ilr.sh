import Link from "next/link"

import db from "@/lib/db"
import { AuthSession } from "@/modules/auth"
import { LinksManager } from "@/components/admin/links-manager"
import { BioPreview } from "@/components/admin/bio-preview"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"
const shortHost = origin.replace(/\/$/, "")

export default async function AdminLinksPage() {
	const user = await AuthSession.requireUser()
	const [links, bioPage] = await Promise.all([
		db.link.findMany({
			where: { userId: user.id, deletedAt: null },
			orderBy: { createdAt: "desc" },
			take: 100,
		}),
		db.bioPage.findUnique({
			where: { userId: user.id },
			include: {
				avatarImage: { select: { url: true } },
				links: { orderBy: { sortOrder: "asc" }, include: { link: true } },
			},
		}),
	])

	const previewLinks = (bioPage?.links ?? [])
		.filter((item) => item.isVisible)
		.slice(0, 5)
		.map((item) => ({
			id: item.id,
			title: item.title,
			description: item.description,
			destinationUrl: item.link?.destinationUrl ?? item.destinationUrl,
			slug: item.link?.slug ?? null,
		}))

	return (
		<main className="px-4 py-6 sm:px-8 sm:py-8">
			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<LinksManager
					origin={origin}
					shortHost={shortHost}
					links={links.map((link) => ({
						id: link.id,
						title: link.title,
						slug: link.slug,
						destinationUrl: link.destinationUrl,
						isActive: link.isActive,
						createdAt: link.createdAt.toISOString(),
					}))}
				/>

				<aside className="hidden xl:block">
					<div className="sticky top-6">
						<BioPreview
							name={bioPage?.name ?? user.name}
							username={user.username}
							headline={bioPage?.headline ?? null}
							avatarUrl={bioPage?.avatarImage?.url ?? null}
							links={previewLinks}
							ctaLabel={bioPage?.ctaLabel ?? null}
						/>
						<Link
							href="/admin/page"
							className="mt-3 block rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-emerald-300/25 hover:text-white"
						>
							Editar Bio page →
						</Link>
					</div>
				</aside>
			</div>
		</main>
	)
}
