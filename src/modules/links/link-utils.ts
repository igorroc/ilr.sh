import { randomBytes } from "crypto"

export const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const MIN_SLUG_LENGTH = 6

export function generateSlug(length = MIN_SLUG_LENGTH) {
	let slug = ""
	while (slug.length < length) {
		for (const byte of randomBytes(length)) {
			if (byte < 248) slug += BASE62[byte % BASE62.length]
			if (slug.length === length) break
		}
	}
	return slug
}

export function validateDestinationUrl(value: string) {
	let url: URL
	try {
		url = new URL(value.trim())
	} catch {
		throw new Error("Informe uma URL HTTP ou HTTPS completa e válida.")
	}
	if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
		throw new Error("Informe uma URL HTTP ou HTTPS sem credenciais.")
	}
	return url.toString()
}
