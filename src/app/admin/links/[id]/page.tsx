import Link from "next/link"
import { notFound } from "next/navigation"
import { LinkService } from "@/modules/links"
import { updateLinkAction } from "../../actions"

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const link = await LinkService.getOwned(id)
	if (!link) notFound()
	return (
		<main className="mx-auto w-full max-w-xl px-6 py-10">
			<Link href="/admin" className="text-sm text-sky-200 hover:underline">
				Voltar aos links
			</Link>
			<h1 className="mt-4 text-3xl font-black text-white">Editar link</h1>
			<form
				action={updateLinkAction.bind(null, link.id)}
				className="mt-7 space-y-5 rounded-2xl border border-white/15 bg-white/10 p-6"
			>
				<p className="rounded-xl bg-slate-950/40 p-3 text-sm text-slate-300">
					Slug imutável: <strong className="text-white">{link.slug}</strong>
				</p>
				<label className="block text-sm font-medium">
					URL de destino
					<input
						required
						name="destinationUrl"
						type="url"
						defaultValue={link.destinationUrl}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Título
					<input
						name="title"
						defaultValue={link.title ?? ""}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="flex items-center gap-2">
					<input name="isActive" type="checkbox" defaultChecked={link.isActive} /> Link ativo
				</label>
				<button className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
					Salvar alterações
				</button>
			</form>
		</main>
	)
}
