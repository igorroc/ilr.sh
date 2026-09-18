import type { Metadata } from "next"

import { LoginContent } from "@/components/auth/login-content"

export const metadata: Metadata = {
	title: "Entrar",
	description: "Acesse sua conta do ilr.sh para gerenciar seus links e sua bio page.",
}

export default function Login() {
	return <LoginContent />
}
