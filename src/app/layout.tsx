import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"
const siteName = "ilr.sh"
const defaultTitle = "ilr.sh — Links simples, sob seu controle."
const defaultDescription =
	"Crie links curtos privados, controle os destinos e concentre o essencial numa página pública."

export const metadata: Metadata = {
	metadataBase: new URL(appUrl),
	title: { default: defaultTitle, template: `%s | ${siteName}` },
	description: defaultDescription,
	applicationName: siteName,
	authors: [{ name: siteName, url: appUrl }],
	creator: siteName,
	publisher: siteName,
	category: "technology",
	keywords: ["encurtador de links", "links curtos", "link na bio", "página de links", "ilr.sh"],
	alternates: { canonical: appUrl },
	openGraph: {
		type: "website",
		siteName,
		locale: "pt_BR",
		url: appUrl,
		title: defaultTitle,
		description: defaultDescription,
	},
	twitter: {
		card: "summary_large_image",
		title: defaultTitle,
		description: defaultDescription,
	},
	robots: { index: true, follow: true },
	icons: {
		icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
	},
}

export const viewport: Viewport = {
	themeColor: "#10b981",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR">
			<body className={inter.className}>
				<Providers>
					<ToastContainer />
					<Analytics />
					{children}
				</Providers>
			</body>
		</html>
	)
}
