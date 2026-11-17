import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Toasts } from "@/components/toasts";

import appCss from "@/global-styles/tailwind.css?url";

const title = "Adishwar Rishi";
const description =
  "Adishwar Rishi is a product engineer at Airwallex in Sydney. His site is a letter about his work, his side projects and how to write back.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f1e9da" },
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://adishwar-rishi.com/" },
      { property: "og:image", content: "https://adishwar-rishi.com/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "The name Adishwar Rishi written in ink on paper, in Latin and Devanagari, above a pen sketch of Sydney Harbour.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Geist+Mono:wght@400;500&family=Tiro+Devanagari+Sanskrit&display=swap",
      },
      // The declared size stops Chrome from choosing the ICO over the SVG.
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="grid min-h-[80vh] content-center px-[clamp(28px,8vw,96px)]">
      <p className="mb-[18px] font-mono text-label text-mute uppercase">404</p>
      <h1 className="mb-[0.6em] text-heading font-light">There’s no page at this address.</h1>
      <p>
        <a href="/" className="font-mono text-label text-mute uppercase hover:text-accent">
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
