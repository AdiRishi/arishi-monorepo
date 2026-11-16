import { vi } from "vitest";

/** Replaces the system clipboard, which a test page in an unfocused frame can't write to. */
export function fakeClipboard() {
  const clipboard = { text: "" };
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(async (text) => {
    clipboard.text = text;
  });
  return clipboard;
}
