import { expect, test } from "@playwright/test";

test("someone opens the home page and sees the site's name", async ({ page }) => {
  const assetFailures: string[] = [];
  page.on("response", (response) => {
    if (["script", "stylesheet"].includes(response.request().resourceType()) && !response.ok())
      assetFailures.push(response.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Adishwar Rishi" })).toBeVisible();
  expect(assetFailures).toEqual([]);
});
