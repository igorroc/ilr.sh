import type { Metadata } from "next"

import { LogoutContent } from "@/components/auth/logout-content"

export const metadata: Metadata = {
	title: "Sair",
	robots: { index: false, follow: false },
}

type LogoutPageProps = {
	searchParams: Promise<{
		reason?: string
	}>
}

export default async function Logout({ searchParams }: LogoutPageProps) {
	const { reason } = await searchParams

	return <LogoutContent isExpired={reason === "expired"} />
}
