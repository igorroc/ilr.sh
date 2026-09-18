import "server-only"

import { Prisma } from "@prisma/client"

import db from "@/lib/db"
import { AuthSession } from "@/modules/auth"
import { validateUsername } from "./username"

export class UserService {
	static async updateProfile(input: { name: string; username: string }) {
		const user = await AuthSession.requireUser()
		const name = input.name.trim()
		if (!name) throw new Error("O nome é obrigatório.")
		const username = validateUsername(input.username)
		try {
			return await db.user.update({ where: { id: user.id }, data: { name, username } })
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				throw new Error("Este username já está sendo utilizado.")
			}
			throw error
		}
	}
}
