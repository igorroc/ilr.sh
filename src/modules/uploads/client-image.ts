import type { UploadPreset } from "./upload-presets"

function formatBytes(bytes: number) {
	return `${Math.round(bytes / 1024 / 1024)} MB`
}

function baseNameWithoutExtension(name: string) {
	const base = name.split("/").pop() ?? "imagem"
	return base.replace(/\.[a-z0-9]+$/i, "") || "imagem"
}

async function canvasToWebP(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/webp", quality))
}

export type CompressedImage = {
	file: File
	width: number
	height: number
}

export async function compressImage(file: File, preset: UploadPreset): Promise<CompressedImage> {
	if (file.size > preset.maxSourceBytes) {
		throw new Error(`A imagem deve ter no máximo ${formatBytes(preset.maxSourceBytes)}.`)
	}

	let bitmap: ImageBitmap
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
	} catch {
		throw new Error("Não foi possível ler essa imagem. Use JPG, PNG, WebP ou AVIF.")
	}

	try {
		const targetAspect = preset.maxWidth / preset.maxHeight
		const sourceAspect = bitmap.width / bitmap.height
		let cropWidth = bitmap.width
		let cropHeight = bitmap.height
		if (sourceAspect > targetAspect) {
			cropWidth = Math.round(bitmap.height * targetAspect)
		} else {
			cropHeight = Math.round(bitmap.width / targetAspect)
		}
		const cropX = Math.round((bitmap.width - cropWidth) / 2)
		const cropY = Math.round((bitmap.height - cropHeight) / 2)
		const scale = Math.min(1, preset.maxWidth / cropWidth, preset.maxHeight / cropHeight)
		const outputWidth = Math.max(1, Math.round(cropWidth * scale))
		const outputHeight = Math.max(1, Math.round(cropHeight * scale))

		const canvas = document.createElement("canvas")
		canvas.width = outputWidth
		canvas.height = outputHeight
		const context = canvas.getContext("2d")
		if (!context) throw new Error("Não foi possível processar a imagem neste navegador.")
		context.drawImage(bitmap, cropX, cropY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight)

		const qualities = [preset.quality, 0.7, 0.6]
		for (const quality of qualities) {
			const blob = await canvasToWebP(canvas, quality)
			if (blob && blob.size <= preset.maxOutputBytes) {
				return {
					file: new File([blob], `${baseNameWithoutExtension(file.name)}.webp`, {
						type: "image/webp",
					}),
					width: outputWidth,
					height: outputHeight,
				}
			}
		}
		throw new Error("Mesmo otimizada, a imagem ficou grande demais. Tente uma imagem menor.")
	} finally {
		bitmap.close()
	}
}
