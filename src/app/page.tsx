import Link from "next/link"

export default function Home() {
	return (
		<main className="mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-12">
			<section className="w-full rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-14">
				<p className="text-sm font-bold tracking-[0.2em] text-sky-200">ILR.SH</p>
				<h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
					Links simples, sob seu controle.
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
					Encurte links e reúna seus destinos importantes em uma única página pessoal.
				</p>
				<Link
					href="/auth/login"
					className="mt-9 inline-block rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-400"
				>
					Entrar
				</Link>
			</section>
		</main>
	)
}
