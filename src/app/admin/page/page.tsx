import { AuthSession } from "@/modules/auth"
import db from "@/lib/db"
import {
	addBioLinkAction,
	deleteBioLinkAction,
	moveBioLinkAction,
	savePageAction,
	updateBioLinkAction,
} from "../actions"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

export default async function AdminBioPage() {
	const user = await AuthSession.requireUser()
	const page = await db.bioPage.findUnique({
		where: { userId: user.id },
		include: { links: { orderBy: { sortOrder: "asc" }, include: { link: true } } },
	})
	const availableLinks = await db.link.findMany({
		where: { userId: user.id, deletedAt: null, isActive: true },
		orderBy: { createdAt: "desc" },
	})
	return (
		<main className="mx-auto w-full max-w-3xl px-6 py-10">
			<h1 className="text-3xl font-black text-white">Minha página</h1>
			{user.username ? (
				<p className="mt-2 text-slate-300">
					Endereço público:{" "}
					<a className="text-sky-200 hover:underline" href={`/@${user.username}`} target="_blank">
						{origin}/@{user.username}
					</a>
				</p>
			) : (
				<p className="mt-2 text-amber-200">Defina seu username no perfil antes de publicar.</p>
			)}
			<form
				action={savePageAction}
				className="mt-7 space-y-5 rounded-2xl border border-white/15 bg-white/10 p-6"
			>
				<label className="block text-sm font-medium">
					Nome público
					<input
						required
						name="name"
						defaultValue={page?.name ?? user.name}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Cargo ou chamada curta
					<input
						name="headline"
						defaultValue={page?.headline ?? ""}
						placeholder="Founder. CTO. Builder."
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Descrição
					<input
						name="description"
						defaultValue={page?.description ?? ""}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Competências
					<input
						name="topics"
						defaultValue={Array.isArray(page?.topics) ? page.topics.join(", ") : ""}
						placeholder="Produto, Tecnologia, IA"
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
					<span className="mt-2 block text-xs text-slate-400">
						Separe por vírgulas, até 12 itens.
					</span>
				</label>
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="block text-sm font-medium">
						Texto do botão principal
						<input
							name="ctaLabel"
							defaultValue={page?.ctaLabel ?? ""}
							placeholder="Vamos conversar"
							className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
						/>
					</label>
					<label className="block text-sm font-medium">
						URL do botão principal
						<input
							name="ctaUrl"
							type="url"
							defaultValue={page?.ctaUrl ?? ""}
							placeholder="https://wa.me/..."
							className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
						/>
					</label>
				</div>
				<label className="block text-sm font-medium">
					Quote
					<textarea
						name="quote"
						defaultValue={page?.quote ?? ""}
						placeholder="Tecnologia é mais poderosa quando aproxima pessoas, produtos e oportunidades."
						rows={3}
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="block text-sm font-medium">
					Cor de destaque do quote
					<input
						name="quoteAccentColor"
						defaultValue={page?.quoteAccentColor ?? "#DCFCE7"}
						placeholder="#DCFCE7"
						pattern="#[0-9A-Fa-f]{6}"
						className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
					/>
				</label>
				<label className="flex items-center gap-2">
					<input
						name="isPublished"
						type="checkbox"
						defaultChecked={page?.isPublished ?? false}
						disabled={!user.username}
					/>{" "}
					Publicar página
				</label>
				<button className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
					{page ? "Salvar página" : "Criar página"}
				</button>
			</form>
			{page && (
				<>
					<section className="mt-8">
						<h2 className="text-2xl font-bold text-white">Links exibidos</h2>
						<div className="mt-4 space-y-3">
							{page.links.map((item) => (
								<div key={item.id} className="rounded-2xl border border-white/15 bg-white/10 p-4">
									<form
										action={updateBioLinkAction.bind(null, item.id)}
										className="grid gap-3 sm:grid-cols-2"
									>
										<input
											name="title"
											defaultValue={item.title}
											className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-white"
										/>
										<input
											name="description"
											defaultValue={item.description ?? ""}
											placeholder="Subtítulo do link"
											className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-white"
										/>
										{item.linkId ? (
											<p className="rounded-xl bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
												/r/{item.link?.slug}
											</p>
										) : (
											<input
												name="destinationUrl"
												type="url"
												defaultValue={item.destinationUrl ?? ""}
												className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-white"
											/>
										)}
										<input
											name="accentColor"
											defaultValue={item.accentColor ?? ""}
											placeholder="#E0F2FE (opcional)"
											pattern="#[0-9A-Fa-f]{6}"
											className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-white"
										/>
										<label className="flex items-center gap-2 text-sm">
											<input name="isVisible" type="checkbox" defaultChecked={item.isVisible} />{" "}
											Visível
										</label>
										<button className="rounded-xl border border-white/20 px-3 py-2 hover:bg-white/10">
											Salvar
										</button>
									</form>
									<div className="mt-3 flex gap-2">
										<form action={moveBioLinkAction.bind(null, item.id, "up")}>
											<button className="rounded-lg border border-white/20 px-3 py-1 text-sm">
												Subir
											</button>
										</form>
										<form action={moveBioLinkAction.bind(null, item.id, "down")}>
											<button className="rounded-lg border border-white/20 px-3 py-1 text-sm">
												Descer
											</button>
										</form>
										<form action={deleteBioLinkAction.bind(null, item.id)}>
											<button className="rounded-lg border border-red-300/30 px-3 py-1 text-sm text-red-200">
												Remover
											</button>
										</form>
									</div>
								</div>
							))}
							{!page.links.length && <p className="text-slate-300">Nenhum link adicionado.</p>}
						</div>
					</section>
					<section className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-6">
						<h2 className="text-xl font-bold text-white">Adicionar link</h2>
						<p className="mt-1 text-sm text-slate-300">
							Escolha um link curto ou informe uma URL direta, nunca os dois.
						</p>
						<form action={addBioLinkAction} className="mt-5 grid gap-4">
							<input
								required
								name="title"
								placeholder="Título do link"
								className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
							/>
							<input
								name="description"
								placeholder="Subtítulo do link (opcional)"
								className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
							/>
							<select
								name="linkId"
								className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
							>
								<option value="">URL direta (preencha abaixo)</option>
								{availableLinks.map((link) => (
									<option key={link.id} value={link.id}>
										{link.title || link.slug} (/r/{link.slug})
									</option>
								))}
							</select>
							<input
								name="destinationUrl"
								type="url"
								placeholder="https://exemplo.com (apenas para URL direta)"
								className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
							/>
							<input
								name="accentColor"
								placeholder="#E0F2FE (cor opcional)"
								pattern="#[0-9A-Fa-f]{6}"
								className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-3 text-white"
							/>
							<button className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400">
								Adicionar link
							</button>
						</form>
					</section>
				</>
			)}
		</main>
	)
}
