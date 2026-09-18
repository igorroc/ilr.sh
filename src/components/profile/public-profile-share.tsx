"use client"

import { Modal, useOverlayState } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"

type PublicProfileShareProps = {
	name: string
	username: string
	headline?: string | null
	avatarUrl?: string | null
	linksCount?: number
}

const BRAND_PATHS = {
	x: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
	linkedin:
		"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
	reddit:
		"M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
}

function BrandIcon({ d, className }: { d: string; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={className ?? "h-5 w-5"}
			fill="currentColor"
		>
			<path d={d} />
		</svg>
	)
}

export function PublicProfileShare({
	name,
	username,
	headline,
	avatarUrl,
	linksCount = 0,
}: PublicProfileShareProps) {
	const state = useOverlayState()
	const [copied, setCopied] = useState(false)

	const shareTitle = `${name} | ilr.sh`
	const pageUrl = typeof window === "undefined" ? "" : window.location.href

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(window.location.href)
			toast.success("Link do perfil copiado.")
			setCopied(true)
			window.setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error("Não foi possível copiar o link.")
		}
	}

	const encodedUrl = encodeURIComponent(pageUrl)
	const encodedTitle = encodeURIComponent(shareTitle)
	const shareTargets = [
		{
			label: "X",
			href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
			icon: <BrandIcon d={BRAND_PATHS.x} />,
		},
		{
			label: "LinkedIn",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			icon: <BrandIcon d={BRAND_PATHS.linkedin} />,
		},
		{
			label: "Reddit",
			href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
			icon: <BrandIcon d={BRAND_PATHS.reddit} />,
		},
	]

	return (
		<Modal state={state}>
			<Modal.Trigger className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
				<svg
					viewBox="0 0 24 24"
					aria-hidden="true"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
				</svg>
				Compartilhar
			</Modal.Trigger>
			<Modal.Backdrop className="bg-black/70 backdrop-blur-sm">
				<Modal.Container placement="center" className="w-full max-w-md px-4">
					<Modal.Dialog
						aria-label={`Compartilhar perfil de ${name}`}
						className="rounded-[28px] border border-white/10 bg-[#171717] p-6 text-white shadow-2xl"
					>
						<Modal.Header className="flex items-center justify-between gap-4">
							<h2 className="text-xl font-bold tracking-tight">Quem é {name}</h2>
							<Modal.CloseTrigger
								aria-label="Fechar"
								className="grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
							/>
						</Modal.Header>

						<Modal.Body className="mt-5 space-y-5">
							<div className="flex items-center gap-3.5 rounded-2xl bg-white/[0.07] p-4">
								{avatarUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={avatarUrl}
										alt={`Avatar de ${name}`}
										className="h-12 w-12 shrink-0 rounded-full object-cover"
									/>
								) : (
									<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-400 text-xl font-black text-slate-950">
										{name.charAt(0).toUpperCase()}
									</span>
								)}
								<div className="min-w-0">
									<p className="truncate font-extrabold">{name}</p>
									<p className="truncate text-sm text-slate-400">@{username}</p>
									{headline ? (
										<p className="mt-0.5 truncate text-sm text-slate-300">{headline}</p>
									) : (
										<p className="mt-0.5 text-sm text-slate-400">
											{linksCount} {linksCount === 1 ? "link" : "links"} · ilr.sh
										</p>
									)}
								</div>
							</div>

							<div>
								<p className="flex items-center gap-2 font-bold">
									<svg
										viewBox="0 0 24 24"
										aria-hidden="true"
										className="h-5 w-5 shrink-0"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
									>
										<circle cx="12" cy="12" r="9" />
										<path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
									</svg>
									Partilhar perfil público
								</p>
								<p className="mt-1.5 text-sm leading-6 text-slate-400">
									Qualquer pessoa com este link pode ver a página pública de {name}. Apenas
									informações públicas são partilhadas.{" "}
									<Link href="/" className="text-slate-200 underline hover:text-white">
										Saiba mais
									</Link>
								</p>
							</div>

							<div className="grid grid-cols-4 gap-2">
								<button
									type="button"
									onClick={copyLink}
									className="flex flex-col items-center gap-2"
								>
									<span
										className={`grid h-12 w-12 place-items-center rounded-full transition ${
											copied
												? "bg-emerald-400 text-slate-950"
												: "bg-white/15 text-white hover:bg-white/25"
										}`}
									>
										{copied ? (
											<svg
												viewBox="0 0 24 24"
												aria-hidden="true"
												className="h-5 w-5"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
											>
												<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										) : (
											<svg
												viewBox="0 0 24 24"
												aria-hidden="true"
												className="h-5 w-5"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
											>
												<path
													d="M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										)}
									</span>
									<span className="text-xs text-slate-300">
										{copied ? "Copiado!" : "Copiar link"}
									</span>
								</button>
								{shareTargets.map((target) => (
									<a
										key={target.label}
										href={target.href}
										target="_blank"
										rel="noreferrer"
										aria-label={`Compartilhar no ${target.label}`}
										className="flex flex-col items-center gap-2"
									>
										<span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
											{target.icon}
										</span>
										<span className="text-xs text-slate-300">{target.label}</span>
									</a>
								))}
							</div>
						</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}
