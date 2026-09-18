"use client"

import { useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import { ApiClient } from "@/lib/api/api-client"
import { TypeGuard } from "@/lib/api/api-result"

type LogoutContentProps = {
	isExpired: boolean
}

export function LogoutContent({ isExpired }: LogoutContentProps) {
	const router = useRouter()
	const hasLoggedOut = useRef(false)

	useEffect(() => {
		if (hasLoggedOut.current) return

		hasLoggedOut.current = true

		;(async () => {
			const res = await ApiClient.logout()
			if (TypeGuard.isFailure(res)) {
				toast.error(res.error.message)
				return
			}

			toast.success(
				isExpired ? "Sessão expirada. Entre novamente." : "Sessão encerrada com sucesso.",
			)
			router.push("/")
		})()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#060b09] px-4 py-12 text-center antialiased">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
			/>
			<div className="relative rounded-[24px] border border-white/[0.08] bg-[#0e1512]/90 p-8 shadow-2xl">
				<div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-full bg-emerald-300/30 ring-8 ring-emerald-300/10" />
				<h1 className="text-3xl font-black tracking-tight text-white">
					{isExpired ? "Sessão expirada" : "Encerrando sessão"}
				</h1>
				<p className="mt-3 text-sm text-slate-400">
					{isExpired
						? "Redirecionando para a tela inicial."
						: "Estamos finalizando seu acesso com segurança."}
				</p>
			</div>
		</main>
	)
}
