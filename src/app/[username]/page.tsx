import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PublicProfileShare } from "@/components/profile/public-profile-share"
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

function TopicIcon({ topic }: { topic: string }) {
	const name = topic.toLowerCase()
	const className = "h-4 w-4 shrink-0"
	const common = {
		"aria-hidden": true,
		className,
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
	}

	if (/(fintech|finance|finan|payment|pagamento)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<path d="M4 7h16M6 16h3m2 0h2m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		)
	}
	if (/(product|produto)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 9l8-4.5M12 12L4 7.5M12 12v9" />
			</svg>
		)
	}
	if (/(architecture|arquitetura)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<circle cx="12" cy="5" r="2" />
				<circle cx="5" cy="18" r="2" />
				<circle cx="19" cy="18" r="2" />
				<path d="M12 7v5m0 0l-7 4m7-4l7 4" />
			</svg>
		)
	}
	if (/(\bai\b|ia|artificial)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3zm6 12l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z" />
			</svg>
		)
	}
	if (/(operation|operaç|operac)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<path d="M5 20v-7m7 7V4m7 16v-11" />
			</svg>
		)
	}
	if (/(technology|tecnologia|tech|code|software)/.test(name)) {
		return (
			<svg viewBox="0 0 24 24" {...common}>
				<path d="M8 9l-3 3 3 3m8-6l3 3-3 3m-2-9l-4 12" />
			</svg>
		)
	}
	return (
		<svg viewBox="0 0 24 24" {...common}>
			<path d="M5 5h9l5 5-9 9-5-5V5z" />
			<circle cx="9" cy="9" r="1" />
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
		<main className="min-h-dvh bg-[#f4f8f8] px-3 py-3 text-slate-950 sm:px-6 sm:py-8">
			<div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-900/10">
				<header className="flex items-center justify-between px-5 py-4 sm:px-8">
					<Link
						href="/"
						aria-label="Página inicial do ilr.sh"
						className="flex items-center gap-2.5"
					>
						<Image src="/icon.png" alt="" width={40} height={40} className="h-10 w-10 rounded-lg" />
						<span className="text-xl font-black tracking-tight">ilr.sh</span>
					</Link>
					<PublicProfileShare title={`${page.name} | ilr.sh`} />
				</header>

				<div className="mx-3 aspect-3/1 rounded-2xl border border-dashed border-slate-200 bg-slate-50 sm:mx-6" />

				<section className="grid gap-6 px-5 py-8 sm:px-8 md:grid-cols-[132px_minmax(0,1fr)_240px] md:items-center md:gap-8">
					{/* DiceBear is an external SVG avatar generated from the public username. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={avatarUrl}
						alt={`Avatar de ${page.name}`}
						className="mx-auto h-28 w-28 rounded-full border-4 border-white bg-emerald-300 shadow-xl shadow-emerald-950/15 md:h-32 md:w-32"
					/>
					<div className="text-center md:text-left">
						<div className="flex items-center justify-center gap-2 md:justify-start">
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
							<p className="mt-2 max-w-2xl leading-6 text-pretty text-slate-600">
								{page.description}
							</p>
						)}
					</div>
					{page.ctaUrl && (
						<a
							href={page.ctaUrl}
							target="_blank"
							rel="noreferrer"
							className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 font-bold shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300"
						>
							{page.ctaLabel}
							<ArrowIcon />
						</a>
					)}
				</section>

				{topics.length > 0 && (
					<section className="border-t border-slate-100 px-5 py-6 sm:px-8">
						<div className="flex flex-wrap justify-center gap-2 md:justify-start">
							{topics.map((topic) => (
								<span
									key={topic}
									className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600"
								>
									<TopicIcon topic={topic} />
									{topic}
								</span>
							))}
						</div>
					</section>
				)}

				<section className="px-5 pb-8 sm:px-8 sm:pb-10">
					<h2 className="text-2xl font-black tracking-tight">Links</h2>
					<div className="mt-3 grid gap-3 md:grid-cols-3">
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

				<footer className="mx-5 flex items-center justify-between border-t border-slate-200 py-5 text-sm text-slate-400 sm:mx-8">
					<span className="font-black text-slate-900">ilr.sh</span>
					<span>Build. Share. Connect.</span>
				</footer>
			</div>
		</main>
	)
}
