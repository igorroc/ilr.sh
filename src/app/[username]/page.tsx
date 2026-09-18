import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BioService } from "@/modules/bio"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

async function getPage(username: string) {
	const segment = decodeURIComponent(username)
	if (!segment.startsWith("@")) return null
	return BioService.getPublic(segment.slice(1).toLowerCase())
}

function faviconUrl(destinationUrl: string) {
	try {
		return `${new URL(destinationUrl).origin}/favicon.ico`
	} catch {
		return null
	}
}

function ArrowIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="h-5 w-5"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
		>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	)
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
	const description =
		user.bioPage.description ?? user.bioPage.headline ?? `Links de ${user.bioPage.name}`
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

	const page = user.bioPage
	const topics = Array.isArray(page.topics)
		? page.topics.filter((topic): topic is string => typeof topic === "string")
		: []
	const links = page.links.filter(
		(item) => !item.link || (item.link.isActive && !item.link.deletedAt),
	)
	const avatarUrl = `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(user.username)}`

	return (
		<main className="min-h-dvh bg-[#f8fafc] px-4 py-6 text-slate-950 sm:px-6 sm:py-10">
			<div className="mx-auto flex w-full max-w-xl flex-col">
				<header className="flex items-center justify-between pb-10 text-xl font-black tracking-tight">
					<Link href="/" aria-label="Página inicial do ilr.sh" className="flex items-center gap-2">
						<span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-sm text-white italic">
							ilr
						</span>
						<span>ilr.sh</span>
					</Link>
					<span className="text-sm font-medium text-slate-400">perfil</span>
				</header>

				<section className="text-center">
					{/* DiceBear is an external SVG avatar generated from the public username. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={avatarUrl}
						alt={`Avatar de ${page.name}`}
						className="mx-auto h-28 w-28 rounded-full border-4 border-white bg-emerald-300 shadow-lg shadow-emerald-950/10"
					/>
					<div className="mt-5 flex items-center justify-center gap-2">
						<h1 className="text-3xl font-black tracking-tight sm:text-4xl">{page.name}</h1>
						<span
							title="Perfil verificado"
							className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400 text-sm font-black text-white"
						>
							&#10003;
						</span>
					</div>
					<p className="mt-1 font-medium text-slate-500">@{user.username}</p>
					{page.headline && <p className="mt-2 text-lg font-semibold">{page.headline}</p>}
					{page.description && (
						<p className="mx-auto mt-3 max-w-lg leading-6 text-pretty text-slate-600">
							{page.description}
						</p>
					)}

					{page.ctaUrl && (
						<a
							href={page.ctaUrl}
							target="_blank"
							rel="noreferrer"
							className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-bold shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300"
						>
							{page.ctaLabel}
							<ArrowIcon />
						</a>
					)}

					{topics.length > 0 && (
						<div className="mt-4 flex flex-wrap justify-center gap-2">
							{topics.map((topic) => (
								<span
									key={topic}
									className="rounded-full bg-slate-200/70 px-4 py-2 text-sm font-medium text-slate-600"
								>
									{topic}
								</span>
							))}
						</div>
					)}
				</section>

				<section className="mt-9">
					<h2 className="text-2xl font-black tracking-tight">Links</h2>
					<div className="mt-3 space-y-3">
						{links.map((item) => {
							const destinationUrl = item.link?.destinationUrl ?? item.destinationUrl!
							const iconUrl = faviconUrl(destinationUrl)
							const href = item.link ? `/r/${item.link.slug}` : destinationUrl
							return (
								<a
									key={item.id}
									href={href}
									target={item.link ? undefined : "_blank"}
									rel={item.link ? undefined : "noreferrer"}
									className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
									style={
										item.accentColor ? { backgroundColor: `${item.accentColor}18` } : undefined
									}
								>
									<span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-950 p-2 text-sm font-bold text-white">
										{iconUrl ? (
											/* eslint-disable-next-line @next/next/no-img-element */
											<img src={iconUrl} alt="" className="h-full w-full object-contain" />
										) : (
											item.title.charAt(0).toUpperCase()
										)}
									</span>
									<span className="min-w-0 flex-1 text-left">
										<span className="block truncate font-bold">{item.title}</span>
										{item.description && (
											<span className="block truncate text-sm text-slate-500">
												{item.description}
											</span>
										)}
									</span>
									<span className="shrink-0 transition-transform group-hover:translate-x-0.5">
										<ArrowIcon />
									</span>
								</a>
							)
						})}
					</div>
				</section>

				<footer className="mt-10 flex items-center justify-between border-t border-slate-200 pt-5 text-sm text-slate-400">
					<span className="font-black text-slate-900">ilr.sh</span>
					<span>Build. Share. Connect.</span>
				</footer>
			</div>
		</main>
	)
}
