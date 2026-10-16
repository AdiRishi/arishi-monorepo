import { exports } from "cloudflare:workers";
import { expect, it } from "vitest";

it("renders the site's name on the home page", async () => {
  const response = await exports.default.fetch("https://web.test/");

  expect(response.status).toBe(200);
  expect(await response.text()).toMatch(/<h1[^>]*>Adishwar Rishi<\/h1>/u);
});
