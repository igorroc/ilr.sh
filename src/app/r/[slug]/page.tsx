import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { fetchDestinationPreview, LinkService } from "@/modules/links"
import { AutoRedirect } from "./auto-redirect"

async function getActiveLink(slug: string) {
	const link = await LinkService.resolve(decodeURIComponent(slug))
	if (!link || link.deletedAt || !link.isActive) return null
	return link
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const link = await getActiveLink(slug)
	if (!link) return { title: "Link não encontrado", robots: { index: false, follow: false } }
	// A prévia do link curto replica as metatags da página de destino.
	const preview = await fetchDestinationPreview(link.destinationUrl)
	const title = preview?.title ?? link.title ?? `ilr.sh/${link.slug}`
	const description = preview?.description ?? "Abrir link compartilhado via ilr.sh."
	const images = preview?.image ? [{ url: preview.image, alt: title }] : undefined
	return {
		title,
		description,
		alternates: { canonical: link.destinationUrl },
		robots: { index: false, follow: true },
		openGraph: {
			title,
			description,
			url: link.destinationUrl,
			siteName: "ilr.sh",
			type: "website",
			images,
		},
		twitter: {
			card: images ? "summary_large_image" : "summary",
			title,
			description,
			images,
		},
	}
}

export default async function ShortLinkPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const link = await getActiveLink(slug)
	if (!link) notFound()
	return <AutoRedirect url={link.destinationUrl} label={link.title ?? `ilr.sh/${link.slug}`} />
}
