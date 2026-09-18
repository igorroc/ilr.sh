"use server"

import { revalidatePath } from "next/cache"

import { BioService } from "@/modules/bio"
import { AuthSession } from "@/modules/auth"
import { LinkService } from "@/modules/links"
import { UserService } from "@/modules/users"

const checked = (value: FormDataEntryValue | null) => value === "on"

export type CreateLinkActionResult = { success: true } | { success: false; error: string }

async function revalidatePublicPage() {
	const user = await AuthSession.requireUser()
	if (user.username) revalidatePath(`/@${user.username}`)
}

export async function saveProfileAction(formData: FormData) {
	await UserService.updateProfile({
		name: String(formData.get("name") ?? ""),
		username: String(formData.get("username") ?? ""),
	})
	revalidatePath("/admin/profile")
	revalidatePath("/admin/page")
}

export async function createLinkAction(formData: FormData): Promise<CreateLinkActionResult> {
	try {
		await LinkService.create({
			title: String(formData.get("title") ?? ""),
			slug: String(formData.get("slug") ?? ""),
			destinationUrl: String(formData.get("destinationUrl") ?? ""),
		})
		revalidatePath("/admin")
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Não foi possível criar o link. Tente novamente.",
		}
	}
}

export async function updateLinkAction(id: string, formData: FormData) {
	await LinkService.update(id, {
		title: String(formData.get("title") ?? ""),
		destinationUrl: String(formData.get("destinationUrl") ?? ""),
		isActive: checked(formData.get("isActive")),
	})
	revalidatePath("/admin")
	revalidatePath(`/admin/links/${id}`)
}

export async function setLinkActiveAction(id: string, isActive: boolean) {
	await LinkService.setActive(id, isActive)
	revalidatePath("/admin")
}

export async function deleteLinkAction(id: string) {
	await LinkService.remove(id)
	revalidatePath("/admin")
}

export async function savePageAction(formData: FormData) {
	await BioService.savePage({
		name: String(formData.get("name") ?? ""),
		headline: String(formData.get("headline") ?? ""),
		description: String(formData.get("description") ?? ""),
		ctaLabel: String(formData.get("ctaLabel") ?? ""),
		ctaUrl: String(formData.get("ctaUrl") ?? ""),
		topics: String(formData.get("topics") ?? "")
			.split(",")
			.map((topic) => topic.trim()),
		isPublished: checked(formData.get("isPublished")),
	})
	revalidatePath("/admin/page")
	await revalidatePublicPage()
}

export async function addBioLinkAction(formData: FormData) {
	await BioService.addBioLink({
		title: String(formData.get("title") ?? ""),
		description: String(formData.get("description") ?? ""),
		accentColor: String(formData.get("accentColor") ?? ""),
		linkId: String(formData.get("linkId") ?? "") || undefined,
		destinationUrl: String(formData.get("destinationUrl") ?? "") || undefined,
	})
	revalidatePath("/admin/page")
	await revalidatePublicPage()
}

export async function updateBioLinkAction(id: string, formData: FormData) {
	await BioService.updateBioLink(id, {
		title: String(formData.get("title") ?? ""),
		description: String(formData.get("description") ?? ""),
		accentColor: String(formData.get("accentColor") ?? ""),
		destinationUrl: String(formData.get("destinationUrl") ?? "") || undefined,
		isVisible: checked(formData.get("isVisible")),
	})
	revalidatePath("/admin/page")
	await revalidatePublicPage()
}

export async function deleteBioLinkAction(id: string) {
	await BioService.removeBioLink(id)
	revalidatePath("/admin/page")
	await revalidatePublicPage()
}

export async function moveBioLinkAction(id: string, direction: "up" | "down") {
	await BioService.moveBioLink(id, direction)
	revalidatePath("/admin/page")
	await revalidatePublicPage()
}
