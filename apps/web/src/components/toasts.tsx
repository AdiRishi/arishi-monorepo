import { Toast, ToastDescription, ToastRegion, ToastTitle } from "@ui-sdk/react/toast";

export function Toasts() {
  return (
    <ToastRegion
      side="bottom"
      align="center"
      maxVisible={1}
      data-agent-hidden
      className="fixed inset-auto bottom-0 left-1/2 m-0 mb-6 w-[22rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-visible border-0 bg-paper/0 p-0"
    >
      {() => (
        <Toast className="border border-line bg-paper px-5 py-4 shadow-[0_10px_30px_-12px_rgb(23_22_28/0.35)] transition-[opacity,translate] duration-300 select-none data-ending-style:translate-y-2 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none">
          <ToastTitle className="font-mono text-caption tracking-label text-ink uppercase in-data-[type=error]:text-accent" />
          <ToastDescription className="mt-1 font-light text-mute" />
        </Toast>
      )}
    </ToastRegion>
  );
}
