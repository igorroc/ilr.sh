import Link from "next/link"
import { notFound } from "next/navigation"
import { LinkService } from "@/modules/links"
import { updateLinkAction } from "../../actions"

const inputClass =
	"mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
const labelClass = "block text-[13px] font-semibold text-slate-300"

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const link = await LinkService.getOwned(id)
	if (!link) notFound()
	return (
		<main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-8 sm:py-8">
			<Link href="/admin" className="text-sm font-medium text-emerald-300 hover:underline">
				← Voltar aos links
			</Link>
			<h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-white">Editar link</h1>
			<form
				action={updateLinkAction.bind(null, link.id)}
				className="mt-6 space-y-5 rounded-2xl border border-white/[0.08] bg-[#0e1512]/90 p-5 sm:p-6"
			>
				<p className="rounded-xl border border-emerald-300/15 bg-emerald-400/[0.07] p-3.5 text-sm text-emerald-100/90">
					Slug imutável: <strong className="text-white">/r/{link.slug}</strong>
				</p>
				<label className={labelClass}>
					URL de destino
					<input required name="destinationUrl" type="url" defaultValue={link.destinationUrl} className={inputClass} />
				</label>
				<label className={labelClass}>
					Título
					<input name="title" defaultValue={link.title ?? ""} placeholder={link.slug} className={inputClass} />
				</label>
				<label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200">
					<input name="isActive" type="checkbox" defaultChecked={link.isActive} className="h-4 w-4 accent-emerald-400" /> Link ativo
				</label>
				<button className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] transition hover:bg-emerald-300">
					Salvar alterações
				</button>
			</form>
		</main>
	)
}
