import { exports } from "cloudflare:workers";
import { expect, it } from "vitest";

it("renders the site's name on the home page", async () => {
  const response = await exports.default.fetch("https://web.test/");

  expect(response.status).toBe(200);
  expect(await response.text()).toMatch(/<h1[^>]*>Adishwar Rishi<\/h1>/u);
});

it("renders the home page in its boot state so the typeset name waits for the pen", async () => {
  const response = await exports.default.fetch("https://web.test/");

  expect(await response.text()).toMatch(/<div[^>]*data-state="boot"[^>]*>/u);
});

async function attributesOf(response: Response, selector: string, names: readonly string[]) {
  const found: Record<string, string | null>[] = [];
  await new HTMLRewriter()
    .on(selector, {
      element(element) {
        found.push(Object.fromEntries(names.map((name) => [name, element.getAttribute(name)])));
      },
    })
    .transform(response)
    .arrayBuffer();
  return found;
}

it("renders the section navigation and the work history on the server", async () => {
  const response = await exports.default.fetch("https://web.test/");
  const html = response.clone();

  expect(await attributesOf(response, '[data-slot="navigation-menu"]', ["aria-label"])).toEqual([
    { "aria-label": "Sections" },
  ]);
  expect(await attributesOf(html, '[data-slot="timeline-item"]', ["role", "tabindex"])).toEqual([
    { role: "listitem", tabindex: "0" },
    { role: "listitem", tabindex: "-1" },
  ]);
});
