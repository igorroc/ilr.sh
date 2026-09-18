import { AdminNav } from "@/components/admin/admin-nav"

export const metadata = { robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AdminNav />
			{children}
		</>
	)
}
