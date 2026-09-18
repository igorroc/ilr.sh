import { AuthSession } from "@/modules/auth"
import { saveProfileAction } from "../actions"

export default async function AdminProfilePage() {
	const user = await AuthSession.requireUser()
	return (
		<main className="mx-auto w-full max-w-xl px-6 py-10">
			<h1 className="text-3xl font-black text-white">Meu perfil</h1>
			<p className="mt-2 text-slate-300">Seu username define o endereço da sua página pública.</p>
			<form
				action={saveProfileAction}
				className="mt-7 space-y-5 rounded-2xl border border-white/15 bg-white/10 p-6"
			>
				<label className="block text-sm font-medium">
					Nome
					<input
						required
						name="name"
						defaultValue={user.name}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Username
					<input
						required
						name="username"
						defaultValue={user.username ?? ""}
						placeholder="igor"
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
					<span className="mt-2 block text-xs text-slate-400">
						3 a 30 caracteres: letras minúsculas, números, hífen ou underscore.
					</span>
				</label>
				<label className="block text-sm font-medium">
					E-mail
					<input
						readOnly
						value={user.email}
						className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/20 px-3 py-3 text-slate-400"
					/>
				</label>
				<button className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
					Salvar perfil
				</button>
			</form>
		</main>
	)
}
