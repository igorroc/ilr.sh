"use client"

import { Modal, useOverlayState } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

import { createLinkAction } from "@/app/admin/actions"

export function NewLinkModal() {
	const state = useOverlayState()
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function createLink(formData: FormData) {
		setIsSubmitting(true)
		try {
			const result = await createLinkAction(formData)
			if (!result.success) {
				toast.error(result.error)
				return
			}
			toast.success("Link criado com sucesso.")
			state.close()
			router.refresh()
		} catch {
			toast.error("Não foi possível criar o link. Tente novamente.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Modal state={state}>
			<Modal.Trigger className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-extrabold text-[#06110b] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)] transition hover:bg-emerald-300">
				<span aria-hidden="true" className="text-base leading-none">+</span> Novo link
			</Modal.Trigger>
			<Modal.Backdrop className="bg-black/70 backdrop-blur-sm">
				<Modal.Container placement="center" className="w-full max-w-lg px-4">
					<Modal.Dialog
						aria-label="Criar novo link"
						className="rounded-2xl border border-emerald-300/15 bg-[#0c1210] p-6 text-white shadow-2xl"
					>
						<Modal.Header className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-2xl font-black text-white">Novo link</h2>
								<p className="mt-1 text-sm text-slate-300">
									Crie um link curto sem sair do painel.
								</p>
							</div>
							<Modal.CloseTrigger aria-label="Fechar" className="text-slate-300 hover:text-white" />
						</Modal.Header>
						<form action={createLink} className="mt-6 space-y-5">
							<Modal.Body className="space-y-5">
								<label className="block text-[13px] font-semibold text-slate-300">
									URL de destino
									<input
										required
										name="destinationUrl"
										type="url"
										placeholder="https://exemplo.com"
										className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
									/>
								</label>
								<label className="block text-[13px] font-semibold text-slate-300">
									Título (opcional)
									<input
										name="title"
										placeholder="meu-portfolio"
										className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
									/>
								</label>
								<label className="block text-[13px] font-semibold text-slate-300">
									Slug personalizado (opcional)
									<input
										name="slug"
										placeholder="meu-link"
										className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-white placeholder:text-slate-600 outline-none focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
									/>
								</label>
							</Modal.Body>
							<Modal.Footer className="mt-6 flex justify-end gap-3">
								<button
									type="button"
									onClick={() => state.close()}
									disabled={isSubmitting}
									className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
								>
									Cancelar
								</button>
								<button
									disabled={isSubmitting}
									className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isSubmitting ? "Criando..." : "Criar link"}
								</button>
							</Modal.Footer>
						</form>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}
