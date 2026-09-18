"use client"

import Link from "next/link"
import { Card, Chip } from "@heroui/react"

export function HomeContent() {
	return (
		<main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-12">
			<div className="absolute top-12 left-8 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
			<div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

			<Card className="w-full max-w-3xl border border-white/15 bg-white/10 shadow-2xl shadow-sky-950/40 backdrop-blur-xl">
				<Card.Header className="flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center sm:px-10">
					<Chip
						color="accent"
						variant="soft"
						className="border border-sky-300/20 bg-sky-400/10 text-sky-100"
					>
						ilr.sh
					</Chip>
					<h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-6xl">
						Links simples, sob seu controle.
					</h1>
				</Card.Header>
				<Card.Content className="gap-8 px-6 pb-8 sm:px-10">
					<p className="mx-auto max-w-2xl text-center text-base leading-7 text-slate-200 sm:text-lg">
						Crie links curtos privados, controle seus destinos e concentre os links importantes em
						uma pagina publica.
					</p>

					<div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-200 sm:grid-cols-3">
						<div className="rounded-2xl bg-white/10 p-4">
							<strong className="block text-white">Links curtos</strong>
							Slugs unicos, destinos validados e controle de ativacao.
						</div>
						<div className="rounded-2xl bg-white/10 p-4">
							<strong className="block text-white">Pagina de links</strong>
							Reuna destinos em um unico perfil compartilhavel.
						</div>
						<div className="rounded-2xl bg-white/10 p-4">
							<strong className="block text-white">Area privada</strong>
							Gerencie links, status e sua pagina pessoal.
						</div>
					</div>

					<div className="flex flex-col justify-center gap-3 sm:flex-row">
						<Link
							href="/auth/login"
							className="rounded-2xl bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400"
						>
							Entrar
						</Link>
						<Link
							href="/auth/register"
							className="rounded-2xl bg-fuchsia-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:bg-fuchsia-400"
						>
							Criar conta
						</Link>
						<Link
							href="/admin"
							className="rounded-2xl border border-white/60 bg-white/5 px-6 py-3 text-center font-semibold text-slate-100 transition hover:bg-white/10"
						>
							Abrir painel
						</Link>
					</div>
				</Card.Content>
			</Card>
		</main>
	)
}
