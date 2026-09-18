"use client"

import Link from "next/link"
import { RegisterForm } from "./register-form"

export function RegisterContent() {
	return (
		<main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#060b09] px-4 py-12 antialiased">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
			/>
			<div className="relative w-full max-w-md">
				<Link
					href="/"
					aria-label="ilr.sh — início"
					className="mx-auto flex w-fit items-center gap-2"
				>
					<span className="grid h-9 w-9 place-items-center rounded-[10px] bg-emerald-400 text-base font-black text-[#06110b] italic">
						il
					</span>
					<span className="text-xl font-extrabold tracking-tight text-white">ilr.sh</span>
				</Link>
				<section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#0e1512]/90 p-6 shadow-2xl sm:p-8">
					<p className="text-center text-[13px] font-bold tracking-[0.18em] text-emerald-300 uppercase">
						Comece agora
					</p>
					<h1 className="mt-2 text-center text-3xl font-black tracking-tight text-white">
						Criar conta
					</h1>
					<p className="mt-2 text-center text-sm leading-6 text-slate-400">
						Preencha seus dados para liberar sua área privada.
					</p>
					<div className="mt-6">
						<RegisterForm />
					</div>
					<p className="mt-5 text-center text-sm text-slate-400">
						Já tem uma conta?{" "}
						<Link
							href="/auth/login"
							className="font-bold text-emerald-300 hover:text-emerald-200 hover:underline"
						>
							Entrar
						</Link>
					</p>
				</section>
			</div>
		</main>
	)
}
