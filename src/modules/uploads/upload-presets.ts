export type UploadKind = "avatar" | "banner"

export type UploadPreset = {
	kind: UploadKind
	label: string
	maxWidth: number
	maxHeight: number
	quality: number
	maxSourceBytes: number
	maxOutputBytes: number
	accept: string
	hint: string
}

export const UPLOAD_PRESETS: Record<UploadKind, UploadPreset> = {
	avatar: {
		kind: "avatar",
		label: "Foto de perfil",
		maxWidth: 512,
		maxHeight: 512,
		quality: 0.82,
		maxSourceBytes: 8 * 1024 * 1024,
		maxOutputBytes: 512 * 1024,
		accept: "image/jpeg,image/png,image/webp,image/avif",
		hint: "Quadrada, até 8 MB. Será otimizada para WebP 512×512.",
	},
	banner: {
		kind: "banner",
		label: "Banner",
		maxWidth: 2400,
		maxHeight: 800,
		quality: 0.8,
		maxSourceBytes: 12 * 1024 * 1024,
		maxOutputBytes: 1024 * 1024,
		accept: "image/jpeg,image/png,image/webp,image/avif",
		hint: "Proporção 3:1, até 12 MB. Será otimizada para WebP 2400×800.",
	},
}

export const UPLOAD_KINDS = Object.keys(UPLOAD_PRESETS) as UploadKind[]

export function getUploadPreset(kind: string): UploadPreset | null {
	return (UPLOAD_PRESETS as Record<string, UploadPreset>)[kind] ?? null
}
