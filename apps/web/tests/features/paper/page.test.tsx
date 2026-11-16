import { createAgent } from "@ui-sdk/react/agent";
import { toast } from "@ui-sdk/react/toast";
import { afterEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { Toasts } from "@/components/toasts";
import { PaperPage } from "@/features/paper/page";

import { fakeClipboard } from "../../support/clipboard";

const agent = createAgent();

function renderPage() {
  return render(
    <>
      <PaperPage />
      <Toasts />
    </>,
  );
}

afterEach(() => {
  toast.dismiss();
  vi.restoreAllMocks();
});

it("lets an agent read the page and copy the email address", async () => {
  const clipboard = fakeClipboard();
  await renderPage();

  const onPage = agent.snapshot().filter((entry) => !entry.offPage);
  expect(onPage.map((entry) => entry.label)).toEqual([
    "Sections",
    "Work history",
    "Copy email address",
  ]);
  expect(onPage[0]?.items?.map((item) => item.label)).toEqual([
    "About",
    "Work",
    "Projects",
    "Contact",
    "P.S.",
  ]);
  expect(onPage[1]?.text).toContain("Freelancer");

  const result = await agent.act({ steps: [{ ref: "Copy email address", action: "press" }] });

  expect(result.error).toBeUndefined();
  expect(clipboard.text).toBe("adishwar.rishi@gmail.com");
  await expect
    .element(page.getByRole("region", { name: "Notifications" }))
    .toHaveTextContent("Email address copiedadishwar.rishi@gmail.com");
});

it("tells the reader where to write when the browser refuses the clipboard", async () => {
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
    new DOMException("Write permission denied.", "NotAllowedError"),
  );
  await renderPage();

  await userEvent.click(page.getByRole("button", { name: "Copy email address" }));

  await expect
    .element(page.getByRole("region", { name: "Notifications" }))
    .toHaveTextContent("Couldn't copy the addressWrite to adishwar.rishi@gmail.com.");
});

it("names each employer and describes it by its dates and story", async () => {
  await renderPage();

  const employer = page
    .getByRole("list", { name: "Work history" })
    .getByRole("listitem", { name: "Airwallex" });

  await expect
    .element(employer)
    .toHaveAccessibleDescription(
      "2024–now I started on the cards team, which builds card issuing and spend management. Now I'm on Yield, where a business can put its spare cash into money market funds and take it out again when it needs it. Lately I also set up the coding agents in our codebases and build the tooling around them.",
    );
});

it("reaches every control with Tab, each named, with the work history as one stop", async () => {
  await renderPage();

  const stops: HTMLElement[] = [];
  for (let presses = 0; presses < 100; presses++) {
    await userEvent.tab();
    const focused = document.activeElement;
    if (!(focused instanceof HTMLElement) || focused === document.body || stops.includes(focused))
      break;
    stops.push(focused);
  }

  for (const stop of stops) await expect.element(stop).toHaveAccessibleName();
  expect(stops.filter((stop) => stop.getAttribute("role") === "listitem")).toHaveLength(1);
  expect(stops).toContain(page.getByRole("button", { name: "Copy email address" }).element());
  expect(stops).toContain(page.getByRole("link", { name: "Contact" }).element());
});

it("marks the section the reader has scrolled to in the navigation", async () => {
  await renderPage();

  document.getElementById("projects")?.scrollIntoView();

  const nav = page.getByRole("navigation", { name: "Sections" });
  await expect
    .element(nav.getByRole("link", { name: "Projects" }))
    .toHaveAttribute("aria-current", "page");
  await expect.element(nav.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
});

it("keeps a section marked after the reader dips into the next one and scrolls back", async () => {
  await renderPage();
  const nav = page.getByRole("navigation", { name: "Sections" });
  const work = nav.getByRole("link", { name: "Work" });
  const projectsTop = document.getElementById("projects")?.offsetTop ?? 0;

  scrollTo(0, projectsTop - innerHeight * 0.405);
  await expect
    .element(nav.getByRole("link", { name: "Projects" }))
    .toHaveAttribute("aria-current", "page");
  scrollTo(0, projectsTop - innerHeight * 0.45);

  await expect.element(work).toHaveAttribute("aria-current", "page");
});

it("marks the last section once the page can scroll no further", async () => {
  await renderPage();

  scrollTo(0, document.documentElement.scrollHeight);

  await expect
    .element(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "P.S." }))
    .toHaveAttribute("aria-current", "page");
});
