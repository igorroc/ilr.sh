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
			<Modal.Trigger className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
				Novo link
			</Modal.Trigger>
			<Modal.Backdrop className="bg-slate-950/70 backdrop-blur-sm">
				<Modal.Container placement="center" className="w-full max-w-lg px-4">
					<Modal.Dialog
						aria-label="Criar novo link"
						className="rounded-2xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl"
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
								<label className="block text-sm font-medium">
									URL de destino
									<input
										required
										name="destinationUrl"
										type="url"
										placeholder="https://exemplo.com"
										className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
									/>
								</label>
								<label className="block text-sm font-medium">
									Título (opcional)
									<input
										name="title"
										className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
									/>
								</label>
								<label className="block text-sm font-medium">
									Slug personalizado (opcional)
									<input
										name="slug"
										placeholder="meu-link"
										className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
									/>
								</label>
							</Modal.Body>
							<Modal.Footer className="mt-6 flex justify-end gap-3">
								<button
									type="button"
									onClick={() => state.close()}
									disabled={isSubmitting}
									className="rounded-xl border border-white/20 px-4 py-3 font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Cancelar
								</button>
								<button
									disabled={isSubmitting}
									className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
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
