import Link from "next/link"

import { AuthSession } from "@/modules/auth"
import { saveProfileAction } from "../actions"

const inputClass =
	"mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
const labelClass = "block text-[13px] font-semibold text-slate-300"

export default async function AdminProfilePage() {
	const user = await AuthSession.requireUser()
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-8 sm:py-8">
			<h1 className="text-[26px] font-extrabold tracking-tight text-white">Configurações</h1>
			<p className="mt-1 text-sm text-slate-400">Seu username define o endereço da sua página pública.</p>

			<form
				action={saveProfileAction}
				className="mt-6 space-y-5 rounded-2xl border border-white/[0.08] bg-[#0e1512]/90 p-5 sm:p-6"
			>
				<label className={labelClass}>
					Nome
					<input required name="name" defaultValue={user.name} className={inputClass} />
				</label>
				<label className={labelClass}>
					Username
					<input required name="username" defaultValue={user.username ?? ""} placeholder="igor" className={inputClass} />
					<span className="mt-2 block text-xs font-normal text-slate-500">
						3 a 30 caracteres: letras minúsculas, números, hífen ou underscore.
					</span>
				</label>
				<label className={labelClass}>
					E-mail
					<input
						readOnly
						value={user.email}
						className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-[14px] text-slate-500"
					/>
				</label>
				<button className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] transition hover:bg-emerald-300">
					Salvar perfil
				</button>
			</form>

			<div className="mt-4 flex flex-wrap gap-2.5">
				<Link
					href="/admin/page"
					className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-emerald-300/25 hover:text-white"
				>
					Editar Bio page →
				</Link>
				<Link
					href="/admin"
					className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-emerald-300/25 hover:text-white"
				>
					Gerenciar links →
				</Link>
			</div>
		</main>
	)
}
