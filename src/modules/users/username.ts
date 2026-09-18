const usernamePattern = /^[a-z0-9_-]{3,30}$/

export function normalizeUsername(value: string) {
	return value.trim().toLowerCase()
}

export function validateUsername(value: string) {
	const username = normalizeUsername(value)
	if (!usernamePattern.test(username))
		throw new Error(
			"O username deve ter de 3 a 30 caracteres: letras, números, hífen ou underscore.",
		)
	return username
}
