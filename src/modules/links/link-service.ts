import "server-only"

import { Prisma } from "@prisma/client"

import db from "@/lib/db"
import { AuthSession } from "@/modules/auth"
import { generateSlug, validateDestinationUrl } from "./link-utils"

const customSlugPattern = /^[A-Za-z0-9_-]{3,32}$/
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

function validateCustomSlug(value: string) {
	const slug = value.trim()
	if (!customSlugPattern.test(slug))
		throw new Error(
			"O slug deve ter de 3 a 32 caracteres e usar apenas letras, números, hífen ou underscore.",
		)
	return slug
}

function isUniqueError(error: unknown) {
	return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

async function assertNoRedirectCycle(slug: string, destinationUrl: string) {
	const destination = new URL(destinationUrl)
	const origin = new URL(APP_ORIGIN)
	if (destination.origin !== origin.origin) return
	let candidate = /^\/r\/([^/?#]+)$/.exec(destination.pathname)?.[1]
	const visited = new Set<string>()
	while (candidate) {
		if (candidate === slug) throw new Error("A URL de destino cria um ciclo de redirecionamento.")
		if (visited.has(candidate))
			throw new Error("A URL de destino cria um ciclo de redirecionamento.")
		visited.add(candidate)
		const link = await db.link.findUnique({
			where: { slug: candidate },
			select: { destinationUrl: true },
		})
		if (!link) return
		const next = new URL(link.destinationUrl)
		candidate =
			next.origin === origin.origin ? /^\/r\/([^/?#]+)$/.exec(next.pathname)?.[1] : undefined
	}
}

export class LinkService {
	static async create(input: { title?: string; slug?: string; destinationUrl: string }) {
		const user = await AuthSession.requireUser()
		const destinationUrl = validateDestinationUrl(input.destinationUrl)
		const title = input.title?.trim() || null
		if (input.slug?.trim()) {
			const slug = validateCustomSlug(input.slug)
			await assertNoRedirectCycle(slug, destinationUrl)
			try {
				return await db.link.create({ data: { userId: user.id, title, slug, destinationUrl } })
			} catch (error) {
				if (isUniqueError(error)) throw new Error("Este slug já está sendo utilizado.")
				throw error
			}
		}
		for (let attempt = 0; attempt < 5; attempt++) {
			const slug = generateSlug()
			await assertNoRedirectCycle(slug, destinationUrl)
			try {
				return await db.link.create({ data: { userId: user.id, title, slug, destinationUrl } })
			} catch (error) {
				if (!isUniqueError(error)) throw error
			}
		}
		throw new Error("Não foi possível gerar um slug único. Tente novamente.")
	}

	static async update(
		id: string,
		input: { title?: string; destinationUrl: string; isActive: boolean },
	) {
		const user = await AuthSession.requireUser()
		const existing = await db.link.findFirst({
			where: { id, userId: user.id, deletedAt: null },
			select: { slug: true },
		})
		if (!existing) throw new Error("Link não encontrado ou não autorizado.")
		const destinationUrl = validateDestinationUrl(input.destinationUrl)
		await assertNoRedirectCycle(existing.slug, destinationUrl)
		return db.link.update({
			where: { id },
			data: { title: input.title?.trim() || null, destinationUrl, isActive: input.isActive },
		})
	}

	static async setActive(id: string, isActive: boolean) {
		const user = await AuthSession.requireUser()
		const result = await db.link.updateMany({
			where: { id, userId: user.id, deletedAt: null },
			data: { isActive },
		})
		if (!result.count) throw new Error("Link não encontrado ou não autorizado.")
	}

	static async remove(id: string) {
		const user = await AuthSession.requireUser()
		const result = await db.link.updateMany({
			where: { id, userId: user.id, deletedAt: null },
			data: { deletedAt: new Date(), isActive: false },
		})
		if (!result.count) throw new Error("Link não encontrado ou não autorizado.")
	}

	static async getOwned(id: string) {
		const user = await AuthSession.requireUser()
		return db.link.findFirst({ where: { id, userId: user.id, deletedAt: null } })
	}

	static async resolve(slug: string) {
		return db.link.findUnique({
			where: { slug },
			select: { destinationUrl: true, isActive: true, deletedAt: true },
		})
	}
}
