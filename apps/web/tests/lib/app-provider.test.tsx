import type { AgentComponent } from "@ui-sdk/core/agent";
import { afterEach, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { PaperPage } from "@/features/paper/page";
import { AppProviders } from "@/lib/app-provider";

interface Tool {
  name: string;
  execute: (input: { text: string }) => Promise<AgentComponent[]>;
}

const tools = new Map<string, Tool>();

afterEach(() => {
  tools.clear();
  Reflect.deleteProperty(document, "modelContext");
});

it("gives a browser's agent the page's tools through WebMCP", async () => {
  Object.assign(document, {
    modelContext: {
      registerTool: async (tool: Tool) => {
        tools.set(tool.name, tool);
      },
    },
  });
  await render(
    <AppProviders>
      <PaperPage />
    </AppProviders>,
  );

  expect([...tools.keys()].toSorted()).toEqual(["act", "query", "snapshot"]);
  expect(await tools.get("query")?.execute({ text: "Copy" })).toMatchObject([
    { component: "button", label: "Copy email address", actions: ["press"] },
  ]);
});

it("gives a coding agent the bridge as window.agent in development", async () => {
  await render(
    <AppProviders>
      <PaperPage />
    </AppProviders>,
  );

  expect(window.agent?.snapshot()).toContainEqual(
    expect.objectContaining({ component: "button", label: "Copy email address" }),
  );
});
