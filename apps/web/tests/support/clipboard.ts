import { vi } from "vitest";

// A test page runs in an unfocused frame, which the system clipboard refuses to write from.
export function fakeClipboard() {
  const clipboard = { text: "" };
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(async (text) => {
    clipboard.text = text;
  });
  return clipboard;
}
