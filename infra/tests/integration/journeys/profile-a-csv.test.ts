import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { expect, test } from "@playwright/test";

test("someone uploads a CSV, reads its profile, and downloads it back", async ({ page }) => {
  const source = await readFile(
    resolve(import.meta.dirname, "../../../../fixtures/transactions.csv"),
  );
  const assetFailures: string[] = [];
  page.on("response", (response) => {
    if (["script", "stylesheet"].includes(response.request().resourceType()) && !response.ok())
      assetFailures.push(response.url());
  });
  await page.goto("/");
  const choosing = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Choose CSV" }).click();
  await (
    await choosing
  ).setFiles({ name: "transactions.csv", mimeType: "text/csv", buffer: source });
  await expect(page.getByRole("heading", { name: "Column profile" })).toBeVisible();
  await expect(page.getByText("5 rows", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("row").filter({ has: page.getByRole("cell", { name: "amount", exact: true }) }),
  ).toContainText("4250");
  const downloading = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download" }).click();
  const download = await downloading;
  const path = await download.path();
  if (path === null) throw new Error("The source download did not finish.");
  expect(await readFile(path)).toEqual(source);
  expect(assetFailures).toEqual([]);
});
