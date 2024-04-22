import type { LoaderFunctionArgs, LinksFunction } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindStyles from '~/global-styles/tailwind.css?url';
import { themeSessionResolver } from '~/lib/theme.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStyles }];

export const loader = async (args: LoaderFunctionArgs) => {
  const themeStorage = await themeSessionResolver(args.request);
  return {
    theme: themeStorage.getTheme(),
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const shouldRenderGA = import.meta.env.PROD;
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {shouldRenderGA && <script async src="https://www.googletagmanager.com/gtag/js?id=G-905KM3LRN9" />}
        {shouldRenderGA && (
          <script
            id="gtag-init"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-905KM3LRN9');
        `,
            }}
          />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
