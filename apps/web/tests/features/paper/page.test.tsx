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
    "Off the clock",
    "Contact",
  ]);
  expect(onPage[1]?.text).toContain("Engineering Team Lead at Freelancer");

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

it("names each role by its title and describes it by its dates and summary", async () => {
  await renderPage();

  const role = page
    .getByRole("list", { name: "Work history" })
    .getByRole("listitem", { name: "Engineering Team Lead at Freelancer" });

  await expect
    .element(role)
    .toHaveAccessibleDescription(
      "2019 Managed ten engineers across two regions and took first call on production incidents.",
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
