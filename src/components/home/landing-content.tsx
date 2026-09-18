import Link from "next/link"

function Logo({ dark = false }: { dark?: boolean }) {
	return (
		<span className="flex items-center gap-2">
			<span className="grid h-8 w-8 place-items-center rounded-[10px] bg-emerald-400 text-base font-black text-[#06110b] italic">
				il
			</span>
			<span
				className={`text-[19px] font-extrabold tracking-tight ${dark ? "text-slate-950" : "text-white"}`}
			>
				ilr.sh
			</span>
		</span>
	)
}

function FeatureIcon({ d }: { d: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			className="h-5 w-5"
			aria-hidden="true"
		>
			<path d={d} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

const FEATURES = [
	{
		title: "Links curtos",
		text: "Slugs personalizados ou gerados em Base62, com destinos validados antes de salvar.",
		icon: "M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3",
	},
	{
		title: "Ativar e pausar",
		text: "Controle o status de cada link sem excluir nada. Pausado não resolve, ativo redireciona na hora.",
		icon: "M8 5v14l11-7z",
	},
	{
		title: "Prévias que espelham o destino",
		text: "O link curto carrega título, descrição e imagem da página de destino ao compartilhar.",
		icon: "M4 5h16v11H4zM4 16l4-4 3 3 3-4 2 2M9 8.5h.01",
	},
	{
		title: "Bio page pública",
		text: "Avatar, banner, links, temas e frase de destaque em ilr.sh/@voce, pronta para compartilhar.",
		icon: "M4 6h16M4 12h16M4 18h10M18 16l2 2-2 2",
	},
	{
		title: "Compartilhar com estilo",
		text: "Modal de partilha com prévia do perfil e botões para copiar link, X, LinkedIn e Reddit.",
		icon: "M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
	},
	{
		title: "Privado por padrão",
		text: "Senhas com Argon2id, sessões opacas e um painel que só você acessa. Sem rastreadores.",
		icon: "M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6zM9.5 12l2 2 3.5-4",
	},
]

const STEPS = [
	{
		number: "01",
		title: "Crie sua conta",
		text: "Leva menos de um minuto. Escolha seu username e garanta seu endereço /@voce.",
	},
	{
		number: "02",
		title: "Encurte seus links",
		text: "Cole o destino, personalize o slug e ative. Pronto para compartilhar em qualquer lugar.",
	},
	{
		number: "03",
		title: "Monte sua bio page",
		text: "Adicione foto, banner, links e frase de destaque. Publique e compartilhe o perfil.",
	},
]

function DashboardMock() {
	const links = [
		{ title: "meu-portfolio", short: "ilr.sh/portfolio", active: true },
		{ title: "meus-projetos", short: "ilr.sh/projetos", active: true },
		{ title: "newsletter", short: "ilr.sh/news", active: false },
	]
	return (
		<div
			aria-hidden="true"
			className="rounded-[24px] border border-white/10 bg-[#0b1110] p-4 shadow-2xl sm:p-5"
		>
			<div className="flex items-center justify-between">
				<p className="text-[15px] font-extrabold text-white">Meus links</p>
				<span className="rounded-xl bg-emerald-400 px-3 py-1.5 text-xs font-extrabold text-[#06110b]">
					+ Novo link
				</span>
			</div>
			<div className="mt-4 space-y-2.5">
				{links.map((link) => (
					<div
						key={link.short}
						className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3"
					>
						<span
							className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${link.active ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.05] text-slate-500"}`}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="h-4 w-4"
							>
								<path
									d="M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="min-w-0 flex-1">
							<span className="block truncate text-sm font-bold text-white">{link.title}</span>
							<span className="block truncate text-xs font-medium text-emerald-300/90">
								{link.short}
							</span>
						</span>
						<span
							className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${link.active ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.06] text-slate-500"}`}
						>
							{link.active ? "Ativo" : "Pausado"}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

function BioMock() {
	const links = ["Meu trabalho", "Projetos", "Newsletter"]
	return (
		<div
			aria-hidden="true"
			className="overflow-hidden rounded-[24px] bg-white text-slate-950 shadow-2xl"
		>
			<div className="flex items-center justify-between px-5 py-3.5">
				<span className="flex items-center gap-2 text-[15px] font-extrabold">
					<span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-400 text-xs font-black text-[#06110b] italic">
						il
					</span>
					ilr.sh
				</span>
				<span className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-bold text-white">
					Compartilhar
				</span>
			</div>
			<div className="px-5 pt-4 pb-5 text-center">
				<span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-xl font-black text-[#06110b]">
					I
				</span>
				<p className="mt-2.5 font-extrabold">Igor Rocha</p>
				<p className="text-[13px] text-slate-500">Founder. CTO. Builder.</p>
				<div className="mt-4 space-y-2 text-left">
					{links.map((title) => (
						<div
							key={title}
							className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3.5 py-2.5"
						>
							<span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400/15 text-emerald-600">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="h-4 w-4"
								>
									<path
										d="M10 14a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 5.4M14 10a5 5 0 00-7.07 0L4.1 12.83a5 5 0 007.07 7.07l1.33-1.3"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="text-sm font-bold">{title}</span>
							<span className="ml-auto text-slate-400">›</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export function LandingContent() {
	const year = new Date().getFullYear()
	return (
		<div className="relative min-h-dvh bg-[#060b09] text-slate-100 antialiased">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
			/>

			<header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#060b09]/85 backdrop-blur-md">
				<div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
					<Link href="/" aria-label="ilr.sh — início">
						<Logo />
					</Link>
					<nav className="ml-6 hidden items-center gap-1 text-sm font-medium text-slate-400 md:flex">
						<a
							href="#recursos"
							className="rounded-lg px-3 py-2 transition hover:bg-white/[0.05] hover:text-white"
						>
							Recursos
						</a>
						<a
							href="#como-funciona"
							className="rounded-lg px-3 py-2 transition hover:bg-white/[0.05] hover:text-white"
						>
							Como funciona
						</a>
						<a
							href="#bio"
							className="rounded-lg px-3 py-2 transition hover:bg-white/[0.05] hover:text-white"
						>
							Bio page
						</a>
					</nav>
					<div className="ml-auto flex items-center gap-2">
						<Link
							href="/auth/login"
							className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
						>
							Entrar
						</Link>
						<Link
							href="/auth/register"
							className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-extrabold text-[#06110b] shadow-[0_8px_24px_-8px_rgba(52,211,153,0.6)] transition hover:bg-emerald-300"
						>
							Criar conta
						</Link>
					</div>
				</div>
			</header>

			<main>
				<section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:pt-20">
					<div>
						<p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-200">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
							Encurtador privado + bio page
						</p>
						<h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-balance text-white sm:text-6xl">
							Links simples, sob seu controle.
						</h1>
						<p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
							Crie links curtos com slugs personalizados, controle destinos e status, e reúna o
							essencial numa página pública com a sua cara.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								href="/auth/register"
								className="rounded-2xl bg-emerald-400 px-6 py-3.5 text-center font-extrabold text-[#06110b] shadow-[0_12px_32px_-10px_rgba(52,211,153,0.7)] transition hover:bg-emerald-300"
							>
								Criar conta grátis
							</Link>
							<a
								href="#como-funciona"
								className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-center font-semibold text-slate-100 transition hover:bg-white/[0.07]"
							>
								Ver como funciona
							</a>
						</div>
						<p className="mt-4 text-[13px] text-slate-500">Sem cartão · Seus links, suas regras</p>
					</div>
					<DashboardMock />
				</section>

				<section id="recursos" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
					<p className="text-[13px] font-bold tracking-[0.18em] text-emerald-300 uppercase">
						Recursos
					</p>
					<h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
						Tudo para seus links em um só lugar
					</h2>
					<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map((feature) => (
							<article
								key={feature.title}
								className="rounded-2xl border border-white/[0.08] bg-[#0e1512]/90 p-5 transition hover:border-emerald-300/25"
							>
								<span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
									<FeatureIcon d={feature.icon} />
								</span>
								<h3 className="mt-4 font-extrabold text-white">{feature.title}</h3>
								<p className="mt-1.5 text-sm leading-6 text-slate-400">{feature.text}</p>
							</article>
						))}
					</div>
				</section>

				<section id="como-funciona" className="border-y border-white/[0.07] bg-white/[0.015]">
					<div className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
						<p className="text-[13px] font-bold tracking-[0.18em] text-emerald-300 uppercase">
							Como funciona
						</p>
						<h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
							Do cadastro ao link publicado em minutos
						</h2>
						<ol className="mt-8 grid gap-4 md:grid-cols-3">
							{STEPS.map((step) => (
								<li
									key={step.number}
									className="rounded-2xl border border-white/[0.08] bg-[#0e1512]/90 p-5"
								>
									<p className="text-2xl font-black text-emerald-400/80">{step.number}</p>
									<h3 className="mt-3 font-extrabold text-white">{step.title}</h3>
									<p className="mt-1.5 text-sm leading-6 text-slate-400">{step.text}</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section
					id="bio"
					className="mx-auto grid w-full max-w-6xl scroll-mt-20 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2"
				>
					<BioMock />
					<div>
						<p className="text-[13px] font-bold tracking-[0.18em] text-emerald-300 uppercase">
							Bio page
						</p>
						<h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
							Uma página pública com a sua cara
						</h2>
						<p className="mt-4 leading-7 text-slate-400">
							Seu endereço <span className="font-semibold text-emerald-300">ilr.sh/@voce</span>{" "}
							reúne avatar, banner, links com favicons automáticos, temas de destaque e frase de
							impacto — com prévia de compartilhamento que replica seus dados.
						</p>
						<ul className="mt-6 space-y-2.5 text-sm text-slate-300">
							{[
								"Links com status e ordenação manual",
								"Botão de ação e tópicos de destaque",
								"Modal de partilha para X, LinkedIn e Reddit",
							].map((item) => (
								<li key={item} className="flex items-center gap-2.5">
									<span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-xs font-black text-emerald-300">
										✓
									</span>
									{item}
								</li>
							))}
						</ul>
						<Link
							href="/auth/register"
							className="mt-7 inline-block rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-6 py-3 font-bold text-emerald-100 transition hover:bg-emerald-400/20"
						>
							Garantir meu @username →
						</Link>
					</div>
				</section>

				<section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
					<div className="relative overflow-hidden rounded-[28px] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/[0.14] to-transparent px-6 py-12 text-center sm:px-12">
						<h2 className="mx-auto max-w-xl text-3xl font-black tracking-tight text-balance text-white sm:text-4xl">
							Pronto para organizar seus links?
						</h2>
						<p className="mx-auto mt-3 max-w-md text-slate-400">
							Crie sua conta e publique seu primeiro link curto em menos de um minuto.
						</p>
						<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
							<Link
								href="/auth/register"
								className="rounded-2xl bg-emerald-400 px-6 py-3.5 font-extrabold text-[#06110b] transition hover:bg-emerald-300"
							>
								Criar conta grátis
							</Link>
							<Link
								href="/auth/login"
								className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-slate-100 transition hover:bg-white/[0.07]"
							>
								Entrar
							</Link>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-white/[0.07]">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:px-6">
					<Logo />
					<p className="sm:ml-2">Build a better tomorrow.</p>
					<nav className="flex gap-4 sm:ml-auto">
						<Link href="/auth/login" className="transition hover:text-slate-200">
							Entrar
						</Link>
						<Link href="/auth/register" className="transition hover:text-slate-200">
							Criar conta
						</Link>
						<Link href="/admin" className="transition hover:text-slate-200">
							Painel
						</Link>
					</nav>
					<p className="sm:w-full sm:text-right">© {year} ilr.sh</p>
				</div>
			</footer>
		</div>
	)
}
