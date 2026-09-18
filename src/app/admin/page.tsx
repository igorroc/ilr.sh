import Link from "next/link"

import db from "@/lib/db"
import { AuthSession } from "@/modules/auth"
import { deleteLinkAction, setLinkActiveAction } from "./actions"

const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"

export default async function AdminLinksPage() {
	const user = await AuthSession.requireUser()
	const links = await db.link.findMany({
		where: { userId: user.id, deletedAt: null },
		orderBy: { createdAt: "desc" },
		take: 100,
	})
	return (
		<main className="mx-auto w-full max-w-6xl px-6 py-10">
			<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-white">Links</h1>
					<p className="mt-1 text-slate-300">Gerencie seus links curtos.</p>
				</div>
				<Link
					href="/admin/links/new"
					className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400"
				>
					Novo link
				</Link>
			</div>
			<div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/10">
				<table className="w-full min-w-[760px] text-left text-sm">
					<thead className="border-b border-white/10 text-slate-300">
						<tr>
							<th className="p-4">Título</th>
							<th className="p-4">URL curta</th>
							<th className="p-4">Destino</th>
							<th className="p-4">Status</th>
							<th className="p-4">Criado</th>
							<th className="p-4">Ações</th>
						</tr>
					</thead>
					<tbody>
						{links.map((link) => (
							<tr key={link.id} className="border-b border-white/10 last:border-0">
								<td className="p-4 font-medium text-white">{link.title || "Sem título"}</td>
								<td className="p-4">
									<a
										className="text-sky-200 hover:underline"
										href={`/r/${link.slug}`}
										target="_blank"
									>
										{origin}/r/{link.slug}
									</a>
								</td>
								<td className="max-w-xs truncate p-4 text-slate-300">{link.destinationUrl}</td>
								<td className="p-4">{link.isActive ? "Ativo" : "Desativado"}</td>
								<td className="p-4 text-slate-300">{link.createdAt.toLocaleDateString("pt-BR")}</td>
								<td className="p-4">
									<div className="flex gap-2">
										<Link
											className="rounded-lg border border-white/20 px-3 py-1.5 hover:bg-white/10"
											href={`/admin/links/${link.id}`}
										>
											Editar
										</Link>
										<form action={setLinkActiveAction.bind(null, link.id, !link.isActive)}>
											<button className="rounded-lg border border-white/20 px-3 py-1.5 hover:bg-white/10">
												{link.isActive ? "Desativar" : "Ativar"}
											</button>
										</form>
										<form action={deleteLinkAction.bind(null, link.id)}>
											<button className="rounded-lg border border-red-300/30 px-3 py-1.5 text-red-200 hover:bg-red-500/10">
												Excluir
											</button>
										</form>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!links.length && (
					<p className="p-8 text-center text-slate-300">Você ainda não criou links.</p>
				)}
			</div>
		</main>
	)
}
