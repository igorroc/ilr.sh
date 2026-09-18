import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { AuthSession } from "@/modules/auth"
import { deleteOwnBlob } from "@/modules/uploads/server"
import { getUploadPreset } from "@/modules/uploads/upload-presets"
import { isOwnedBlobUrl, validateUploadPathname } from "@/modules/uploads/upload-paths"

type RouteContext = {
	params: Promise<{ kind: string }>
}

export async function POST(request: Request, { params }: RouteContext) {
	const { kind } = await params
	const preset = getUploadPreset(kind)
	if (!preset) {
		return NextResponse.json({ error: "Tipo de upload inválido." }, { status: 400 })
	}

	const body = (await request.json()) as HandleUploadBody

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname) => {
				const user = await AuthSession.getCurrentUser()
				if (!user) throw new Error("Não autenticado.")
				if (!validateUploadPathname(pathname, user.id, preset.kind)) {
					throw new Error("Caminho de upload inválido.")
				}
				return {
					allowedContentTypes: ["image/webp"],
					maximumSizeInBytes: preset.maxOutputBytes,
					addRandomSuffix: true,
					tokenPayload: JSON.stringify({ userId: user.id, kind: preset.kind }),
				}
			},
		})
		return NextResponse.json(jsonResponse)
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." },
			{ status: 400 },
		)
	}
}

export async function DELETE(request: Request, { params }: RouteContext) {
	const { kind } = await params
	if (!getUploadPreset(kind)) {
		return NextResponse.json({ error: "Tipo de upload inválido." }, { status: 400 })
	}
	const user = await AuthSession.getCurrentUser()
	if (!user) {
		return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
	}
	const { url } = (await request.json().catch(() => ({}))) as { url?: string }
	if (!url || !isOwnedBlobUrl(url, user.id)) {
		return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 })
	}
	await deleteOwnBlob(url, user.id)
	return NextResponse.json({ success: true })
}
