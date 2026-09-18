"use client"

import { useRef, useState } from "react"
import { toast } from "react-toastify"

import { prepareImage, uploadPreparedImage } from "@/modules/uploads/upload-client"
import { UPLOAD_PRESETS, type UploadKind } from "@/modules/uploads/upload-presets"

type ImageUploadFieldProps = {
	kind: UploadKind
	userId: string
	name: string
	label: string
	defaultValue?: string | null
	previewShape: "circle" | "wide"
}

export function ImageUploadField({
	kind,
	userId,
	name,
	label,
	defaultValue,
	previewShape,
}: ImageUploadFieldProps) {
	const preset = UPLOAD_PRESETS[kind]
	const [value, setValue] = useState(defaultValue ?? "")
	const [preview, setPreview] = useState(defaultValue ?? "")
	const [meta, setMeta] = useState("")
	const [isUploading, setIsUploading] = useState(false)
	const sessionUploadRef = useRef<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	async function deleteSessionUpload(url: string) {
		try {
			await fetch(`/api/uploads/${kind}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url }),
			})
		} catch {
			// Orphan cleanup is best-effort; the saved page keeps the last persisted URL.
		}
	}

	async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		event.target.value = ""
		if (!file) return
		setIsUploading(true)
		try {
			const prepared = await prepareImage(file, preset, userId)
			setPreview(prepared.previewUrl)
			const url = await uploadPreparedImage(prepared, preset)
			if (sessionUploadRef.current && sessionUploadRef.current !== url) {
				void deleteSessionUpload(sessionUploadRef.current)
			}
			sessionUploadRef.current = url
			setValue(url)
			setPreview(url)
			setMeta(
				JSON.stringify({
					sizeBytes: prepared.sizeBytes,
					width: prepared.width,
					height: prepared.height,
				}),
			)
			toast.success("Imagem enviada. Salve a página para publicar.")
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem.")
		} finally {
			setIsUploading(false)
		}
	}

	function handleRemove() {
		if (sessionUploadRef.current) {
			void deleteSessionUpload(sessionUploadRef.current)
			sessionUploadRef.current = null
		}
		if (preview.startsWith("blob:")) URL.revokeObjectURL(preview)
		setValue("")
		setPreview("")
		setMeta("")
	}

	const previewClass =
		previewShape === "circle" ? "h-24 w-24 rounded-full" : "h-24 w-full rounded-xl sm:h-28"

	return (
		<div className="block text-[13px] font-semibold text-slate-300">
			<span>{label}</span>
			<div className="mt-2 flex flex-col gap-3">
				{preview ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={preview}
						alt={`Prévia de ${preset.label.toLowerCase()}`}
						className={`${previewClass} border border-emerald-300/20 bg-[#0a100d] object-cover`}
					/>
				) : (
					<div
						className={`${previewClass} grid place-items-center border border-dashed border-white/10 bg-[#0a100d] px-4 text-center text-xs font-normal text-slate-500`}
					>
						Nenhuma imagem — será usado o padrão.
					</div>
				)}
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={isUploading}
						className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-extrabold text-[#06110b] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isUploading ? "Enviando..." : preview ? "Trocar imagem" : "Enviar imagem"}
					</button>
					{value && (
						<button
							type="button"
							onClick={handleRemove}
							disabled={isUploading}
							className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
						>
							Remover
						</button>
					)}
				</div>
				<span className="text-xs font-normal text-slate-500">{preset.hint}</span>
			</div>
			<input
				ref={inputRef}
				type="file"
				accept={preset.accept}
				onChange={handleSelect}
				className="hidden"
			/>
			<input type="hidden" name={name} value={value} />
			<input type="hidden" name={`${name}Meta`} value={meta} />
		</div>
	)
}
