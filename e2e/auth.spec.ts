import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Willkommen zurück").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("wrong@test.de");
    await page.locator('input[type="password"]').fill("WrongPass123");

    await page.getByRole("button", { name: "Anmelden", exact: true }).click();

    await expect(
      page.locator("[role='alert'], .text-red-600, .text-red-700").first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: /registrieren/i }).click();

    await expect(page).toHaveURL(/register/);
  });
});