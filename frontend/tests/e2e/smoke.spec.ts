import { expect, test } from "@playwright/test";

test("abre landing, guia e workspace", async ({ page }) => {
  await page.goto("/#/inicio");

  await expect(
    page.getByRole("heading", {
      name: /comece pelo que você precisa preparar hoje/i,
    }),
  ).toBeVisible();

  const menuButton = page.getByRole("button", { name: "Menu" });
  if (await menuButton.isVisible()) {
    await menuButton.click();
  }

  await page.getByRole("button", { name: "Como usar" }).click();
  await expect(page).toHaveURL(/#\/como-usar/);
  await expect(
    page.getByRole("heading", {
      name: /comece com uma necessidade ministerial/i,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: /abrir workspace/i }).click();
  await expect(page).toHaveURL(/#\/app/);
  await expect(
    page.getByRole("heading", {
      name: /entre pela necessidade do preparo/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: /esboço/i })).toBeVisible();
});

test("confere health check da API publicada", async ({ request }) => {
  const response = await request.get("https://pregador-ia-api.vercel.app/health");

  expect(response.ok()).toBe(true);
  await expect(response).toBeOK();
  const body = await response.json();

  expect(body).toMatchObject({ status: "OK" });
});
