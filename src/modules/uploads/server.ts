import "server-only"

import { del } from "@vercel/blob"

import { isOwnedBlobUrl } from "./upload-paths"

export async function deleteOwnBlob(url: string, userId: string): Promise<boolean> {
	if (!url || !isOwnedBlobUrl(url, userId)) return false
	await del(url)
	return true
}
