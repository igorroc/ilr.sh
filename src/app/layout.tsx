import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://ilr.sh"),
	title: "ilr.sh",
	description: "Links simples, sob seu controle.",
	icons: {
		icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
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
