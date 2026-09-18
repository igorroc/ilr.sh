import { getUploadPreset } from "./upload-presets"

export function buildUploadPathname(userId: string, kind: string): string {
	const safeUser = userId.replace(/[^A-Za-z0-9_-]/g, "")
	const id =
		typeof crypto !== "undefined" && "randomUUID" in crypto
			? crypto.randomUUID()
			: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
	return `uploads/${safeUser}/${kind}/${id}.webp`
}

export function validateUploadPathname(pathname: string, userId: string, kind: string): boolean {
	if (!pathname || pathname.includes("..") || !pathname.endsWith(".webp")) return false
	if (!getUploadPreset(kind)) return false
	return pathname.startsWith(`uploads/${userId}/${kind}/`)
}

export function isBlobStoreUrl(value: string): boolean {
	try {
		const url = new URL(value)
		return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com")
	} catch {
		return false
	}
}

export type ImageMeta = {
	sizeBytes?: number
	width?: number
	height?: number
}

function toPositiveInt(value: unknown): number | undefined {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return undefined
	return value
}

export function sanitizeImageMeta(value: unknown): ImageMeta | undefined {
	if (!value || typeof value !== "object") return undefined
	const record = value as Record<string, unknown>
	const meta: ImageMeta = {
		sizeBytes: toPositiveInt(record.sizeBytes),
		width: toPositiveInt(record.width),
		height: toPositiveInt(record.height),
	}
	if (meta.sizeBytes === undefined && meta.width === undefined && meta.height === undefined) {
		return undefined
	}
	return meta
}

export function isOwnedBlobUrl(value: string, userId: string): boolean {
	try {
		const url = new URL(value)
		return isBlobStoreUrl(value) && url.pathname.startsWith(`/uploads/${userId}/`)
	} catch {
		return false
	}
}
