"use client"

import { upload } from "@vercel/blob/client"

import { compressImage } from "./client-image"
import { buildUploadPathname } from "./upload-paths"
import type { UploadPreset } from "./upload-presets"

export type PreparedUpload = {
	file: File
	pathname: string
	previewUrl: string
	sizeBytes: number
	width: number
	height: number
}

export async function prepareImage(
	file: File,
	preset: UploadPreset,
	userId: string,
): Promise<PreparedUpload> {
	const compressed = await compressImage(file, preset)
	return {
		file: compressed.file,
		pathname: buildUploadPathname(userId, preset.kind),
		previewUrl: URL.createObjectURL(compressed.file),
		sizeBytes: compressed.file.size,
		width: compressed.width,
		height: compressed.height,
	}
}

export async function uploadPreparedImage(
	prepared: PreparedUpload,
	preset: UploadPreset,
): Promise<string> {
	const blob = await upload(prepared.pathname, prepared.file, {
		access: "public",
		handleUploadUrl: `/api/uploads/${preset.kind}`,
		contentType: "image/webp",
	})
	return blob.url
}
