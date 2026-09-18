"use client"

import { toast } from "react-toastify"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { ApiClient } from "@/lib/api/api-client"
import { TypeGuard } from "@/lib/api/api-result"

const inputClass =
	"w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"

export function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	async function registerClient(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)

		const formData = new FormData(event.currentTarget)

		try {
			const res = await ApiClient.register({
				name: String(formData.get("name") ?? ""),
				email: String(formData.get("email") ?? ""),
				password: String(formData.get("password") ?? ""),
			})

			if (TypeGuard.isFailure(res)) {
				toast.error(res.error.message)
				setIsLoading(false)
				return
			}

			router.replace("/admin/profile")
			router.refresh()
		} catch {
			toast.error("Algo deu errado. Tente novamente mais tarde.")
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={registerClient} className="flex flex-col gap-4">
			<label className="block text-[13px] font-semibold text-slate-300">
				Nome
				<input
					type="text"
					name="name"
					required
					autoComplete="name"
					placeholder="Seu nome"
					disabled={isLoading}
					className={`${inputClass} mt-2`}
				/>
			</label>
			<label className="block text-[13px] font-semibold text-slate-300">
				E-mail
				<input
					type="email"
					name="email"
					required
					autoComplete="email"
					placeholder="voce@email.com"
					disabled={isLoading}
					className={`${inputClass} mt-2`}
				/>
			</label>
			<label className="block text-[13px] font-semibold text-slate-300">
				Senha
				<input
					type="password"
					name="password"
					required
					autoComplete="new-password"
					placeholder="Crie uma senha segura"
					disabled={isLoading}
					className={`${inputClass} mt-2`}
				/>
			</label>
			<button
				type="submit"
				disabled={isLoading}
				className="mt-1 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isLoading ? "Criando conta..." : "Criar conta"}
			</button>
		</form>
	)
}
