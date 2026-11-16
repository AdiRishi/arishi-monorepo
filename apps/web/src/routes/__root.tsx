import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Toasts } from "@/components/toasts";

import appCss from "@/global-styles/tailwind.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Adishwar Rishi" },
      {
        name: "description",
        content:
          "Adishwar Rishi is a senior software engineer at Airwallex in Sydney. He has worked on payments software since 2017.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Geist+Mono:wght@400;500&family=Tiro+Devanagari+Sanskrit&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="grid min-h-[80vh] content-center px-[clamp(28px,8vw,96px)]">
      <p className="mb-[18px] font-mono text-caption tracking-[0.2em] text-mute uppercase">404</p>
      <h1 className="mb-[0.6em] text-[clamp(2rem,5vw,4rem)] font-light tracking-[-0.015em]">
        There&apos;s no page at this address.
      </h1>
      <p>
        <a
          href="/"
          className="font-mono text-caption tracking-label text-mute uppercase hover:text-accent"
        >
          Go to the home page
        </a>
      </p>
    </main>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toasts />
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  );
}
