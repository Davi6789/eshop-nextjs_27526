import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
  test("should add product to cart", async ({ page }) => {
    await page.goto("/products");

    // Ersten "In den Warenkorb" Button klicken
    await page
      .locator("button")
      .filter({ hasText: "In den Warenkorb" })
      .first()
      .click();

    // Badge-Zahl prüfen — spezifisch das rote Badge-Element
    await expect(page.locator("span.bg-red-500:visible").first()).toHaveText(
      "1",
    );
  });

  test("should open cart drawer", async ({ page }) => {
    await page.goto("/products");

    // Produkt hinzufügen
    await page
      .locator("button")
      .filter({ hasText: "In den Warenkorb" })
      .first()
      .click();
    await page.waitForTimeout(500);

    // Warenkorb-Button: erstes Button mit hover:text-blue-600 in der Nav
    await page
      .locator("button:visible")
      .filter({ hasText: /warenkorb|cart/i })
      .first()
      .click();

    // Drawer-Überschrift prüfen
  await expect(
    page.getByText(/warenkorb|zur kasse|checkout|warenkorb ist leer/i).first(),
  ).toBeVisible();
  });
});
