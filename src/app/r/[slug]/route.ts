import { LinkService } from "@/modules/links"

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const link = await LinkService.resolve(slug)
	if (!link) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } })
	if (link.deletedAt)
		return new Response(null, { status: 410, headers: { "Cache-Control": "no-store" } })
	if (!link.isActive)
		return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } })
	return new Response(null, {
		status: 302,
		headers: { Location: link.destinationUrl, "Cache-Control": "no-store" },
	})
}

export const HEAD = GET
