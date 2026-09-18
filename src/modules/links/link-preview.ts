import "server-only"

import { lookup } from "node:dns/promises"

export type DestinationPreview = {
	title?: string
	description?: string
	image?: string
}

const FETCH_TIMEOUT_MS = 3500
const MAX_BYTES = 300_000
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

/**
 * Busca as metatags da página de destino para que o link curto (`/r/[slug]`)
 * replique título, descrição e imagem de prévia do destino.
 * Retorna `null` quando a extração não é possível ou segura — o chamador
 * deve usar valores genéricos de fallback.
 */
export async function fetchDestinationPreview(
	destinationUrl: string,
): Promise<DestinationPreview | null> {
	try {
		const target = new URL(destinationUrl)
		if (!/^https?:$/.test(target.protocol)) return null
		if (target.origin === new URL(APP_ORIGIN).origin) return null
		const hostname = target.hostname.toLowerCase()
		if (hostname === "localhost" || hostname.endsWith(".localhost")) return null
		await assertPublicHostname(hostname)

		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
		try {
			const response = await fetch(target.toString(), {
				signal: controller.signal,
				redirect: "follow",
				headers: {
					"user-agent": "Mozilla/5.0 (compatible; ilr.sh/1.0; +https://ilr.sh)",
					accept: "text/html,application/xhtml+xml",
				},
			})
			if (!response.ok) return null
			const contentType = response.headers.get("content-type") ?? ""
			if (!/text\/html|application\/xhtml/i.test(contentType)) return null
			const html = await readCappedText(response)
			if (!html) return null
			return extractPreview(html, target)
		} finally {
			clearTimeout(timeout)
		}
	} catch {
		return null
	}
}

async function assertPublicHostname(hostname: string) {
	let addresses: Array<{ address: string }>
	try {
		addresses = await lookup(hostname, { all: true })
	} catch {
		throw new Error("Host não resolvido.")
	}
	if (!addresses.length || addresses.some((entry) => isPrivateIp(entry.address))) {
		throw new Error("Host privado ou inválido.")
	}
}

function isPrivateIp(ip: string): boolean {
	const lower = ip.toLowerCase()
	// IPv4 mapeado em IPv6 (ex.: ::ffff:192.168.0.1): avalia a parte IPv4.
	const lastSegment = lower.split(":").pop() ?? ""
	if (/^\d+\.\d+\.\d+\.\d+$/.test(lastSegment)) return isPrivateIpv4(lastSegment)
	if (lower === "::1") return true
	if (lower.startsWith("fc") || lower.startsWith("fd")) return true
	if (lower.startsWith("fe80")) return true
	// Qualquer outro formato inesperado é tratado como não público.
	return lower.includes(":")
}

function isPrivateIpv4(ip: string): boolean {
	const parts = ip.split(".").map(Number)
	if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
		return true
	}
	const [a, b] = parts
	if (a === 0 || a === 10 || a === 127) return true
	if (a === 169 && b === 254) return true
	if (a === 172 && b >= 16 && b <= 31) return true
	return a === 192 && b === 168;
}

async function readCappedText(response: Response): Promise<string> {
	if (!response.body) return ""
	const reader = response.body.getReader()
	const chunks: Uint8Array[] = []
	let received = 0
	try {
		for (;;) {
			const { done, value } = await reader.read()
			if (done) break
			if (value) {
				received += value.byteLength
				if (received > MAX_BYTES) {
					chunks.push(value.subarray(0, Math.max(0, MAX_BYTES - (received - value.byteLength))))
					break
				}
				chunks.push(value)
			}
		}
	} finally {
		reader.releaseLock()
		try {
			await response.body.cancel()
		} catch {
			// Ignora: o corpo já foi parcialmente consumido.
		}
	}
	const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
	const merged = new Uint8Array(total)
	let offset = 0
	for (const chunk of chunks) {
		merged.set(chunk, offset)
		offset += chunk.byteLength
	}
	return new TextDecoder("utf-8").decode(merged)
}

function extractPreview(html: string, base: URL): DestinationPreview | null {
	const headEnd = html.search(/<\/head\s*>/i)
	const head = headEnd > 0 ? html.slice(0, headEnd) : html

	const title =
		metaContent(head, "property", "og:title") ??
		titleTag(head) ??
		metaContent(head, "name", "twitter:title")
	const description =
		metaContent(head, "property", "og:description") ??
		metaContent(head, "name", "description") ??
		metaContent(head, "name", "twitter:description")
	const imageSrc =
		metaContent(head, "property", "og:image") ??
		metaContent(head, "property", "og:image:secure_url") ??
		metaContent(head, "name", "twitter:image")

	const preview: DestinationPreview = {}
	if (title) preview.title = title.slice(0, 160)
	if (description) preview.description = description.slice(0, 300)
	const image = resolveHttpUrl(imageSrc, base)
	if (image) preview.image = image
	if (!preview.title && !preview.description && !preview.image) return null
	return preview
}

function metaContent(html: string, attr: "property" | "name", value: string) {
	const tag = html.match(new RegExp(`<meta[^>]*${attr}=["']${value}["'][^>]*>`, "i"))?.[0]
	if (!tag) return undefined
	const quoted = tag.match(/content=(["'])(.*?)\1/i)?.[2]
	const unquoted = quoted ?? tag.match(/content=([^"'`\s>]+)/i)?.[1]
	const text = (unquoted ?? "").trim()
	return text || undefined
}

function titleTag(html: string) {
	const raw = html.match(/<title[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]
	if (!raw) return undefined
	const text = decodeEntities(raw.replace(/\s+/g, " ").trim())
	return text || undefined
}

function decodeEntities(value: string) {
	return value
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#0?39;/g, "'")
}

function resolveHttpUrl(value: string | undefined, base: URL) {
	if (!value) return undefined
	try {
		const url = new URL(value, base)
		if (!/^https?:$/.test(url.protocol)) return undefined
		return url.toString()
	} catch {
		return undefined
	}
}
