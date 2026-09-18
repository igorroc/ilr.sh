import { expect, test } from "bun:test"

import { BASE62, generateSlug, MIN_SLUG_LENGTH, validateDestinationUrl } from "./link-utils"

test("generates a six-character Base62 slug", () => {
	const slug = generateSlug()
	expect(slug).toHaveLength(MIN_SLUG_LENGTH)
	expect([...slug].every((character) => BASE62.includes(character))).toBe(true)
})

test("normalizes valid HTTP destinations and preserves query parameters", () => {
	expect(validateDestinationUrl("https://example.com/path?source=ilr")).toBe(
		"https://example.com/path?source=ilr",
	)
})

test("rejects non-HTTP URLs and embedded credentials", () => {
	expect(() => validateDestinationUrl("javascript:alert(1)")).toThrow()
	expect(() => validateDestinationUrl("https://user:pass@example.com")).toThrow()
})
