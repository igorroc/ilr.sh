"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { BioService } from "@/modules/bio"
import { LinkService } from "@/modules/links"
import { UserService } from "@/modules/users"

const checked = (value: FormDataEntryValue | null) => value === "on"

export async function saveProfileAction(formData: FormData) {
	await UserService.updateProfile({
		name: String(formData.get("name") ?? ""),
		username: String(formData.get("username") ?? ""),
	})
	revalidatePath("/admin/profile")
	revalidatePath("/admin/page")
}

export async function createLinkAction(formData: FormData) {
	const link = await LinkService.create({
		title: String(formData.get("title") ?? ""),
		slug: String(formData.get("slug") ?? ""),
		destinationUrl: String(formData.get("destinationUrl") ?? ""),
	})
	redirect(`/admin/links/${link.id}`)
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
		description: String(formData.get("description") ?? ""),
		isPublished: checked(formData.get("isPublished")),
	})
	revalidatePath("/admin/page")
}

export async function addBioLinkAction(formData: FormData) {
	await BioService.addBioLink({
		title: String(formData.get("title") ?? ""),
		linkId: String(formData.get("linkId") ?? "") || undefined,
		destinationUrl: String(formData.get("destinationUrl") ?? "") || undefined,
	})
	revalidatePath("/admin/page")
}

export async function updateBioLinkAction(id: string, formData: FormData) {
	await BioService.updateBioLink(id, {
		title: String(formData.get("title") ?? ""),
		destinationUrl: String(formData.get("destinationUrl") ?? "") || undefined,
		isVisible: checked(formData.get("isVisible")),
	})
	revalidatePath("/admin/page")
}

export async function deleteBioLinkAction(id: string) {
	await BioService.removeBioLink(id)
	revalidatePath("/admin/page")
}

export async function moveBioLinkAction(id: string, direction: "up" | "down") {
	await BioService.moveBioLink(id, direction)
	revalidatePath("/admin/page")
}
