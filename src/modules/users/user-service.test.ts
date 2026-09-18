import { expect, test } from "bun:test"

import { normalizeUsername, validateUsername } from "./username"

test("normalizes usernames to lowercase", () => {
	expect(normalizeUsername("  Igor_Rocha ")).toBe("igor_rocha")
})

test("accepts only supported username characters", () => {
	expect(validateUsername("igor-rocha_1")).toBe("igor-rocha_1")
	expect(() => validateUsername("igor rocha")).toThrow()
	expect(() => validateUsername("ig")).toThrow()
})
