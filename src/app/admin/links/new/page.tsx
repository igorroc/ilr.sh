import Link from "next/link"
import { createLinkAction } from "../../actions"

export default function NewLinkPage() {
	return (
		<main className="mx-auto w-full max-w-xl px-6 py-10">
			<Link href="/admin" className="text-sm text-sky-200 hover:underline">
				Voltar aos links
			</Link>
			<h1 className="mt-4 text-3xl font-black text-white">Novo link</h1>
			<form
				action={createLinkAction}
				className="mt-7 space-y-5 rounded-2xl border border-white/15 bg-white/10 p-6"
			>
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
				<button className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
					Criar link
				</button>
			</form>
		</main>
	)
}
