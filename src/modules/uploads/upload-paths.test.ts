import { describe, expect, test } from "bun:test"

import {
	buildUploadPathname,
	isBlobStoreUrl,
	isOwnedBlobUrl,
	sanitizeImageMeta,
	validateUploadPathname,
} from "./upload-paths"

describe("upload-paths", () => {
	test("builds a pathname namespaced by user and kind", () => {
		const pathname = buildUploadPathname("user_123", "avatar")
		expect(pathname.startsWith("uploads/user_123/avatar/")).toBe(true)
		expect(pathname.endsWith(".webp")).toBe(true)
	})

	test("accepts only pathnames owned by the user", () => {
		expect(validateUploadPathname("uploads/user_1/avatar/a.webp", "user_1", "avatar")).toBe(true)
		expect(validateUploadPathname("uploads/other/avatar/a.webp", "user_1", "avatar")).toBe(false)
		expect(validateUploadPathname("uploads/user_1/banner/a.webp", "user_1", "avatar")).toBe(false)
		expect(validateUploadPathname("uploads/user_1/avatar/../a.webp", "user_1", "avatar")).toBe(
			false,
		)
		expect(validateUploadPathname("uploads/user_1/avatar/a.png", "user_1", "avatar")).toBe(false)
		expect(validateUploadPathname("uploads/user_1/unknown/a.webp", "user_1", "unknown")).toBe(false)
	})

	test("sanitizes image metadata", () => {
		expect(sanitizeImageMeta({ sizeBytes: 123, width: 512, height: 512 })).toEqual({
			sizeBytes: 123,
			width: 512,
			height: 512,
		})
		expect(sanitizeImageMeta({ sizeBytes: -1, width: 1.5, height: "x" })).toBeUndefined()
		expect(sanitizeImageMeta(null)).toBeUndefined()
	})

	test("recognizes blob store urls", () => {
		expect(isBlobStoreUrl("https://abc.public.blob.vercel-storage.com/x.webp")).toBe(true)
		expect(isBlobStoreUrl("https://example.com/x.webp")).toBe(false)
		expect(
			isOwnedBlobUrl(
				"https://abc.public.blob.vercel-storage.com/uploads/user_1/avatar/a.webp",
				"user_1",
			),
		).toBe(true)
		expect(
			isOwnedBlobUrl(
				"https://abc.public.blob.vercel-storage.com/uploads/other/avatar/a.webp",
				"user_1",
			),
		).toBe(false)
	})
})
