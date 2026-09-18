import "server-only"

import db from "@/lib/db"
import { AuthSession } from "@/modules/auth"
import { validateDestinationUrl } from "@/modules/links"

export class BioService {
	static async savePage(input: {
		name: string
		headline?: string
		description?: string
		ctaLabel?: string
		ctaUrl?: string
		topics: string[]
		isPublished: boolean
	}) {
		const user = await AuthSession.requireUser()
		const name = input.name.trim()
		if (!name) throw new Error("O nome público é obrigatório.")
		if (input.isPublished && !user.username)
			throw new Error("Defina seu username antes de publicar sua página.")
		const ctaUrl = input.ctaUrl?.trim()
		const ctaLabel = input.ctaLabel?.trim()
		if (ctaLabel && !ctaUrl) throw new Error("Informe a URL do botão principal.")
		const topics = [...new Set(input.topics.map((topic) => topic.trim()).filter(Boolean))].slice(
			0,
			12,
		)
		if (topics.some((topic) => topic.length > 32))
			throw new Error("Cada competência pode ter no máximo 32 caracteres.")
		const data = {
			name,
			headline: input.headline?.trim() || null,
			description: input.description?.trim() || null,
			ctaLabel: ctaUrl ? ctaLabel || "Vamos conversar" : null,
			ctaUrl: ctaUrl ? validateDestinationUrl(ctaUrl) : null,
			topics,
			isPublished: input.isPublished,
		}
		return db.bioPage.upsert({
			where: { userId: user.id },
			create: { userId: user.id, ...data },
			update: data,
		})
	}

	static async addBioLink(input: {
		title: string
		description?: string
		accentColor?: string
		linkId?: string
		destinationUrl?: string
	}) {
		const user = await AuthSession.requireUser()
		const page = await db.bioPage.findUnique({ where: { userId: user.id }, select: { id: true } })
		if (!page) throw new Error("Crie sua página antes de adicionar links.")
		const title = input.title.trim()
		if (!title) throw new Error("O título é obrigatório.")
		const hasLink = Boolean(input.linkId)
		const hasUrl = Boolean(input.destinationUrl?.trim())
		if (hasLink === hasUrl) throw new Error("Escolha um link encurtado ou informe uma URL direta.")
		if (hasLink) {
			const link = await db.link.findFirst({
				where: { id: input.linkId, userId: user.id, deletedAt: null, isActive: true },
				select: { id: true },
			})
			if (!link) throw new Error("O link encurtado selecionado não está disponível.")
		}
		const last = await db.bioLink.aggregate({
			where: { pageId: page.id },
			_max: { sortOrder: true },
		})
		return db.bioLink.create({
			data: {
				pageId: page.id,
				title,
				description: input.description?.trim() || null,
				accentColor: normalizeAccentColor(input.accentColor),
				linkId: input.linkId || null,
				destinationUrl: hasUrl ? validateDestinationUrl(input.destinationUrl!) : null,
				sortOrder: (last._max.sortOrder ?? -1) + 1,
			},
		})
	}

	static async updateBioLink(
		id: string,
		input: {
			title: string
			description?: string
			accentColor?: string
			destinationUrl?: string
			isVisible: boolean
		},
	) {
		const user = await AuthSession.requireUser()
		const item = await db.bioLink.findFirst({
			where: { id, page: { userId: user.id } },
			select: { linkId: true },
		})
		if (!item) throw new Error("Link da página não encontrado ou não autorizado.")
		const title = input.title.trim()
		if (!title) throw new Error("O título é obrigatório.")
		if (item.linkId && input.destinationUrl?.trim())
			throw new Error("Links encurtados não podem receber uma URL direta.")
		if (!item.linkId && !input.destinationUrl?.trim()) throw new Error("Informe uma URL direta.")
		return db.bioLink.update({
			where: { id },
			data: {
				title,
				description: input.description?.trim() || null,
				accentColor: normalizeAccentColor(input.accentColor),
				isVisible: input.isVisible,
				destinationUrl: item.linkId ? undefined : validateDestinationUrl(input.destinationUrl!),
			},
		})
	}

	static async removeBioLink(id: string) {
		const user = await AuthSession.requireUser()
		const result = await db.bioLink.deleteMany({ where: { id, page: { userId: user.id } } })
		if (!result.count) throw new Error("Link da página não encontrado ou não autorizado.")
	}

	static async moveBioLink(id: string, direction: "up" | "down") {
		const user = await AuthSession.requireUser()
		const item = await db.bioLink.findFirst({
			where: { id, page: { userId: user.id } },
			select: { id: true, pageId: true, sortOrder: true },
		})
		if (!item) throw new Error("Link da página não encontrado ou não autorizado.")
		const neighbor = await db.bioLink.findFirst({
			where: {
				pageId: item.pageId,
				sortOrder: direction === "up" ? { lt: item.sortOrder } : { gt: item.sortOrder },
			},
			orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
			select: { id: true, sortOrder: true },
		})
		if (!neighbor) return
		await db.$transaction([
			db.bioLink.update({ where: { id: item.id }, data: { sortOrder: neighbor.sortOrder } }),
			db.bioLink.update({ where: { id: neighbor.id }, data: { sortOrder: item.sortOrder } }),
		])
	}

	static async getPublic(username: string) {
		return db.user.findUnique({
			where: { username },
			select: {
				username: true,
				bioPage: {
					where: { isPublished: true },
					select: {
						name: true,
						headline: true,
						description: true,
						ctaLabel: true,
						ctaUrl: true,
						topics: true,
						links: {
							where: { isVisible: true },
							orderBy: { sortOrder: "asc" },
							select: {
								id: true,
								title: true,
								description: true,
								accentColor: true,
								destinationUrl: true,
								link: {
									select: { slug: true, destinationUrl: true, isActive: true, deletedAt: true },
								},
							},
						},
					},
				},
			},
		})
	}
}

function normalizeAccentColor(value?: string) {
	const color = value?.trim()
	if (!color) return null
	if (!/^#[0-9a-f]{6}$/i.test(color))
		throw new Error("A cor do link deve estar no formato #RRGGBB.")
	return color
}
