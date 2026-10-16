import { useCallback, useEffect } from "react";

interface UseClipboardImageOptions {
  onImageSelect?: (file: File) => void;
  enableKeyboardShortcut?: boolean;
}

export const useClipboardImage = (options: UseClipboardImageOptions = {}) => {
  const { onImageSelect, enableKeyboardShortcut = false } = options;

  const pasteImageFromClipboard = useCallback(
    async (imageSelectCallback?: (file: File) => void) => {
      const callback = imageSelectCallback || onImageSelect;
      if (!callback) return;

      try {
        if (!navigator.clipboard || !navigator.clipboard.read) {
          throw new Error("Clipboard API not supported");
        }

        const clipboardItems = await navigator.clipboard.read();

        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            if (type.startsWith("image/")) {
              const blob = await clipboardItem.getType(type);
              const file = new File([blob], "pasted-image.png", { type });
              callback(file);
              return;
            }
          }
        }

        // No image found in clipboard
        console.log("No image found in clipboard");
      } catch (error) {
        console.error("Failed to read from clipboard:", error);
        // You might want to show a toast notification here
      }
    },
    [onImageSelect],
  );

  // Keyboard shortcut handler
  useEffect(() => {
    if (!enableKeyboardShortcut || !onImageSelect) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+V (Windows/Linux) or Cmd+V (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        event.preventDefault();
        pasteImageFromClipboard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enableKeyboardShortcut, onImageSelect, pasteImageFromClipboard]);

  return {
    pasteImageFromClipboard,
  };
};
