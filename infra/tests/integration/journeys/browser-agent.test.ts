import { expect, test } from "@playwright/test";

// A browser with WebMCP gives the page document.modelContext. This stands in for that browser
// and lets the journey call each registered tool by name, as its agent would.
const browserWithWebMcp = `
  const tools = new Map();
  document.modelContext = { registerTool: async (tool) => void tools.set(tool.name, tool) };
  window.registeredTools = tools;
  window.callTool = (name, input) => tools.get(name).execute(input);
`;

test("someone's browser agent reads the home page and copies the email address", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript({ content: browserWithWebMcp });
  await page.goto("/");
  // The page registers its tools once it hydrates.
  await page.waitForFunction(`registeredTools.size === 3`);

  expect(await page.evaluate(`callTool("snapshot", {})`)).toEqual([
    expect.objectContaining({ component: "navigation-menu", label: "Sections" }),
    expect.objectContaining({ component: "timeline", label: "Work history" }),
    expect.objectContaining({ component: "button", label: "Copy email address" }),
  ]);
  expect(
    await page.evaluate(
      `callTool("act", { steps: [{ ref: "Copy email address", action: "press" }] })`,
    ),
  ).toMatchObject({ ok: true });

  await expect(page.getByRole("region", { name: "Notifications" })).toContainText(
    "Email address copied",
  );
  expect(await page.evaluate(`navigator.clipboard.readText()`)).toBe("adishwar.rishi@gmail.com");
});
