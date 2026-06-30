import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/E-Shop/)
    await expect(page.getByText("Willkommen bei E-Shop").first()).toBeVisible()
  })

  test("should navigate to products", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Produkte" }).first().click()
    await expect(page).toHaveURL(/products/)
  })

  test("should have working search", async ({ page }) => {
    await page.goto("/products")
    await page.getByPlaceholder("Suchen...").fill("Kopfhörer")
    await page.waitForTimeout(500)

    // Spezifisch h3 in Produktkarte, nicht Autocomplete-Button
    await expect(
      page.locator("h3").filter({ hasText: "Premium Wireless Kopfhörer" }).first()
    ).toBeVisible({ timeout: 5000 })
  })
})