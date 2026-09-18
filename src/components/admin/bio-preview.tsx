import { LinkFavicon } from "@/components/profile/link-favicon"

export type BioPreviewLink = {
	id: string
	title: string
	description: string | null
	destinationUrl: string | null
	slug: string | null
}

type BioPreviewProps = {
	name: string
	username: string | null
	headline: string | null
	avatarUrl: string | null
	links: BioPreviewLink[]
	ctaLabel?: string | null
}

export function BioPreview({ name, username, headline, avatarUrl, links, ctaLabel }: BioPreviewProps) {
	const initial = (name || "i").charAt(0).toUpperCase()
	return (
		<div className="overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#0b1110] shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_24px_80px_-32px_rgba(52,211,153,0.35)]">
			<div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
				<span className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-white">
					<span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-400 text-[12px] font-black text-[#06110b] italic">
						il
					</span>
					ilr.sh
				</span>
				<span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400">
					prévia
				</span>
			</div>

			<div className="px-5 pt-7 pb-6 text-center">
				{avatarUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={avatarUrl}
						alt={`Avatar de ${name}`}
						className="mx-auto h-16 w-16 rounded-full border-2 border-emerald-300/40 object-cover"
					/>
				) : (
					<span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-2xl font-black text-[#06110b]">
						{initial}
					</span>
				)}
				<p className="mt-3 text-[17px] font-extrabold text-white">{name || "Seu nome"}</p>
				<p className="mt-0.5 text-[13px] text-slate-400">
					{headline || (username ? `@${username}` : "Ideias levam a lugares")}
				</p>

				<div className="mt-5 space-y-2.5 text-left">
					{(links.length ? links : [{ id: "empty-1", title: "Meu trabalho", description: null, destinationUrl: null, slug: null }, { id: "empty-2", title: "Projetos", description: null, destinationUrl: null, slug: null }, { id: "empty-3", title: "Newsletter", description: null, destinationUrl: null, slug: null }]).slice(0, 5).map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3"
						>
							<span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-400/10 text-emerald-200">
								{item.destinationUrl || item.slug ? (
									<LinkFavicon destinationUrl={item.destinationUrl ?? `https://ilr.sh/${item.slug}`} title={item.title} />
								) : (
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
										<path d="M20 7H4a1 1 0 00-1 1v8a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zm-9 5l4-2.5L11 7v5z" strokeLinejoin="round" />
									</svg>
								)}
							</span>
							<span className="min-w-0 flex-1">
								<span className="block truncate text-[14px] font-bold text-white">{item.title}</span>
								{item.description && (
									<span className="block truncate text-xs text-slate-500">{item.description}</span>
								)}
							</span>
							<span aria-hidden="true" className="text-slate-600">›</span>
						</div>
					))}
				</div>

				{ctaLabel && (
					<div className="mt-4 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b]">
						{ctaLabel}
					</div>
				)}

				<p className="mt-5 text-[11px] text-slate-600">ilr.sh — links simples, sob seu controle.</p>
			</div>
		</div>
	)
}
