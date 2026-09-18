import { AuthSession } from "@/modules/auth"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { BioPreview } from "@/components/admin/bio-preview"
import db from "@/lib/db"
import {
	addBioLinkAction,
	deleteBioLinkAction,
	moveBioLinkAction,
	savePageAction,
	updateBioLinkAction,
} from "../actions"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

const inputClass =
	"mt-2 w-full rounded-xl border border-white/10 bg-[#0a100d] px-3.5 py-3 text-[14px] text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-400/20"
const labelClass = "block text-[13px] font-semibold text-slate-300"
const cardClass =
	"rounded-2xl border border-white/[0.08] bg-[#0e1512]/90 p-5 sm:p-6 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.9)]"

export default async function AdminBioPage() {
	const user = await AuthSession.requireUser()
	const page = await db.bioPage.findUnique({
		where: { userId: user.id },
		include: {
			avatarImage: { select: { id: true, url: true } },
			bannerImage: { select: { id: true, url: true } },
			links: { orderBy: { sortOrder: "asc" }, include: { link: true } },
		},
	})
	const availableLinks = await db.link.findMany({
		where: { userId: user.id, deletedAt: null, isActive: true },
		orderBy: { createdAt: "desc" },
	})

	return (
		<main className="px-4 py-6 sm:px-8 sm:py-8">
			<div className="flex flex-wrap items-end gap-3">
				<div>
					<h1 className="text-[26px] font-extrabold tracking-tight text-white">Bio page</h1>
					{user.username ? (
						<p className="mt-1 text-sm text-slate-400">
							Endereço público:{" "}
							<a className="font-medium text-emerald-300 hover:underline" href={`/@${user.username}`} target="_blank">
								{origin.replace(/^https?:\/\//, "")}/@{user.username}
							</a>
							{page?.isPublished ? (
								<span className="ml-2 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
									publicada
								</span>
							) : (
								<span className="ml-2 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-bold text-slate-400">
									rascunho
								</span>
							)}
						</p>
					) : (
						<p className="mt-1 text-sm text-amber-200">Defina seu username nas Configurações antes de publicar.</p>
					)}
				</div>
			</div>

			<div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0 space-y-5">
					<form action={savePageAction} className={`${cardClass} space-y-5`}>
						<h2 className="text-[15px] font-extrabold text-white">Aparência e conteúdo</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<ImageUploadField
								kind="avatar"
								userId={user.id}
								name="avatarUrl"
								label="Foto de perfil"
								defaultValue={page?.avatarImage?.url ?? ""}
								previewShape="circle"
							/>
							<ImageUploadField
								kind="banner"
								userId={user.id}
								name="bannerUrl"
								label="Banner"
								defaultValue={page?.bannerImage?.url ?? ""}
								previewShape="wide"
							/>
						</div>
						<label className={labelClass}>
							Nome público
							<input required name="name" defaultValue={page?.name ?? user.name} className={inputClass} />
						</label>
						<div className="grid gap-5 sm:grid-cols-2">
							<label className={labelClass}>
								Cargo ou chamada curta
								<input name="headline" defaultValue={page?.headline ?? ""} placeholder="Founder. CTO. Builder." className={inputClass} />
							</label>
							<label className={labelClass}>
								Competências
								<input
									name="topics"
									defaultValue={Array.isArray(page?.topics) ? page.topics.join(", ") : ""}
									placeholder="Produto, Tecnologia, IA"
									className={inputClass}
								/>
							</label>
						</div>
						<label className={labelClass}>
							Descrição
							<input name="description" defaultValue={page?.description ?? ""} placeholder="Ideias levam a lugares." className={inputClass} />
						</label>
						<div className="grid gap-5 sm:grid-cols-2">
							<label className={labelClass}>
								Texto do botão principal
								<input name="ctaLabel" defaultValue={page?.ctaLabel ?? ""} placeholder="Vamos conversar" className={inputClass} />
							</label>
							<label className={labelClass}>
								URL do botão principal
								<input name="ctaUrl" type="url" defaultValue={page?.ctaUrl ?? ""} placeholder="https://wa.me/..." className={inputClass} />
							</label>
						</div>
						<label className={labelClass}>
							Quote
							<textarea
								name="quote"
								defaultValue={page?.quote ?? ""}
								placeholder="Tecnologia é mais poderosa quando aproxima pessoas, produtos e oportunidades."
								rows={3}
								className={`${inputClass} resize-none`}
							/>
						</label>
						<div className="flex flex-wrap items-center gap-4">
							<label className={`${labelClass} min-w-44 flex-1`}>
								Cor de destaque do quote
								<span className="mt-2 flex items-center gap-2">
									<input
										name="quoteAccentColor"
										type="color"
										defaultValue={page?.quoteAccentColor ?? "#a7f3d0"}
										className="h-11 w-14 cursor-pointer rounded-xl border border-white/10 bg-[#0a100d] p-1"
									/>
									<span className="text-xs font-normal text-slate-500">Usada no cartão de frase da página pública.</span>
								</span>
							</label>
							<label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200">
								<input
									name="isPublished"
									type="checkbox"
									defaultChecked={page?.isPublished ?? false}
									disabled={!user.username}
									className="h-4 w-4 accent-emerald-400"
								/>
								Publicar página
							</label>
						</div>
						<button className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] transition hover:bg-emerald-300">
							{page ? "Salvar página" : "Criar página"}
						</button>
					</form>

					{page && (
						<>
							<section className={cardClass}>
								<h2 className="text-[15px] font-extrabold text-white">Links exibidos</h2>
								<p className="mt-1 text-[13px] text-slate-500">A ordem aqui é a ordem da página pública.</p>
								<div className="mt-4 space-y-3">
									{page.links.map((item) => (
										<div key={item.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
											<form action={updateBioLinkAction.bind(null, item.id)} className="grid gap-3 sm:grid-cols-2">
												<input name="title" defaultValue={item.title} placeholder="Título" className={inputClass} />
												<input name="description" defaultValue={item.description ?? ""} placeholder="Subtítulo do link" className={inputClass} />
												{item.linkId ? (
													<p className="rounded-xl bg-[#0a100d] px-3.5 py-3 text-sm text-emerald-200/80">
														/r/{item.link?.slug}
													</p>
												) : (
													<input name="destinationUrl" type="url" defaultValue={item.destinationUrl ?? ""} placeholder="https://..." className={inputClass} />
												)}
												<span className="flex items-center gap-2">
													<input name="accentColor" defaultValue={item.accentColor ?? ""} placeholder="#E0F2FE (opcional)" pattern="#[0-9A-Fa-f]{6}" className={inputClass} />
												</span>
												<label className="flex items-center gap-2 text-sm text-slate-300">
													<input name="isVisible" type="checkbox" defaultChecked={item.isVisible} className="h-4 w-4 accent-emerald-400" />
													Visível
												</label>
												<button className="rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.06]">
													Salvar
												</button>
											</form>
											<div className="mt-3 flex gap-2">
												<form action={moveBioLinkAction.bind(null, item.id, "up")}>
													<button className="rounded-lg border border-white/10 px-3 py-1.5 text-[13px] text-slate-300 hover:bg-white/[0.06]">↑ Subir</button>
												</form>
												<form action={moveBioLinkAction.bind(null, item.id, "down")}>
													<button className="rounded-lg border border-white/10 px-3 py-1.5 text-[13px] text-slate-300 hover:bg-white/[0.06]">↓ Descer</button>
												</form>
												<form action={deleteBioLinkAction.bind(null, item.id)} className="ml-auto">
													<button className="rounded-lg border border-red-300/20 px-3 py-1.5 text-[13px] text-red-300 hover:bg-red-500/10">
														Remover
													</button>
												</form>
											</div>
										</div>
									))}
									{!page.links.length && <p className="text-sm text-slate-400">Nenhum link adicionado.</p>}
								</div>
							</section>

							<section className={cardClass}>
								<h2 className="text-[15px] font-extrabold text-white">Adicionar link</h2>
								<p className="mt-1 text-[13px] text-slate-500">Escolha um link curto ou informe uma URL direta, nunca os dois.</p>
								<form action={addBioLinkAction} className="mt-4 grid gap-3">
									<input required name="title" placeholder="Título do link" className={inputClass} />
									<input name="description" placeholder="Subtítulo do link (opcional)" className={inputClass} />
									<select name="linkId" className={inputClass} defaultValue="">
										<option value="">URL direta (preencha abaixo)</option>
										{availableLinks.map((link) => (
											<option key={link.id} value={link.id}>
												{link.title || link.slug} (/r/{link.slug})
											</option>
										))}
									</select>
									<input name="destinationUrl" type="url" placeholder="https://exemplo.com (apenas para URL direta)" className={inputClass} />
									<input name="accentColor" placeholder="#E0F2FE (cor opcional)" pattern="#[0-9A-Fa-f]{6}" className={inputClass} />
									<button className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#06110b] transition hover:bg-emerald-300">
										Adicionar link
									</button>
								</form>
							</section>
						</>
					)}
				</div>

				<aside className="hidden xl:block">
					<div className="sticky top-6">
						<BioPreview
							name={page?.name ?? user.name}
							username={user.username}
							headline={page?.headline ?? null}
							avatarUrl={page?.avatarImage?.url ?? null}
							links={(page?.links ?? [])
								.filter((item) => item.isVisible)
								.slice(0, 5)
								.map((item) => ({
									id: item.id,
									title: item.title,
									description: item.description,
									destinationUrl: item.link?.destinationUrl ?? item.destinationUrl,
									slug: item.link?.slug ?? null,
								}))}
							ctaLabel={page?.ctaLabel ?? null}
						/>
						<p className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[13px] leading-5 text-slate-500">
							A prévia atualiza a cada salvamento. Publique para ver em{" "}
							<span className="text-emerald-300">/{user.username ? `@${user.username}` : "sua página"}</span>.
						</p>
					</div>
				</aside>
			</div>
		</main>
	)
}
