import type { Metadata } from "next"

import { LandingContent } from "@/components/home"

export const metadata: Metadata = {
	title: "Links simples, sob seu controle.",
	description:
		"Crie links curtos privados, controle destinos e status, e reúna o essencial numa bio page pública.",
}

export default function Home() {
	return <LandingContent />
}
