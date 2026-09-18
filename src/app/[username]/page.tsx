import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BioService } from "@/modules/bio"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

async function getPage(username: string) {
	const segment = decodeURIComponent(username)
	if (!segment.startsWith("@")) return null
	return BioService.getPublic(segment.slice(1).toLowerCase())
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ username: string }>
}): Promise<Metadata> {
	const { username } = await params
	const user = await getPage(username)
	if (!user?.bioPage || !user.username) return {}
	const title = `${user.bioPage.name} | ilr.sh`
	const description = user.bioPage.description ?? `Links de ${user.bioPage.name}`
	const url = `${origin}/@${user.username}`
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: { title, description, url, type: "profile" },
	}
}

export default async function PublicBioPage({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params
	const user = await getPage(username)
	if (!user?.bioPage || !user.username) notFound()
	const links = user.bioPage.links.filter(
		(item) => !item.link || (item.link.isActive && !item.link.deletedAt),
	)
	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-6 py-12">
			<section className="rounded-3xl border border-white/15 bg-white/10 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10">
				<p className="mb-3 text-sm font-semibold text-sky-200">@{user.username}</p>
				<h1 className="text-3xl font-black text-white">{user.bioPage.name}</h1>
				{user.bioPage.description && (
					<p className="mt-3 text-slate-300">{user.bioPage.description}</p>
				)}
				<div className="mt-8 flex flex-col gap-3">
					{links.map((item) => (
						<a
							key={item.id}
							href={item.link ? `/r/${item.link.slug}` : item.destinationUrl!}
							className="rounded-2xl bg-white px-5 py-4 font-semibold text-slate-900 transition hover:bg-sky-100"
						>
							{item.title}
						</a>
					))}
				</div>
			</section>
		</main>
	)
}
