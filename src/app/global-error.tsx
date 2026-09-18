"use client"

type GlobalErrorProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function GlobalError({ reset }: GlobalErrorProps) {
	return (
		<html lang="pt-BR">
			<body style={{ margin: 0, background: "#060b09", color: "#f1f5f9" }}>
				<main
					style={{
						display: "grid",
						placeItems: "center",
						minHeight: "100dvh",
						padding: "24px",
						textAlign: "center",
						fontFamily: "system-ui, sans-serif",
					}}
				>
					<div>
						<p style={{ fontSize: "20px", fontWeight: 800 }}>Algo deu errado</p>
						<p style={{ color: "#94a3b8", fontSize: "14px" }}>
							Não foi possível carregar o ilr.sh. Tente novamente.
						</p>
						<button
							type="button"
							onClick={reset}
							style={{
								marginTop: "16px",
								border: 0,
								borderRadius: "16px",
								background: "#34d399",
								color: "#06110b",
								padding: "12px 24px",
								fontWeight: 800,
								cursor: "pointer",
							}}
						>
							Tentar novamente
						</button>
					</div>
				</main>
			</body>
		</html>
	)
}
