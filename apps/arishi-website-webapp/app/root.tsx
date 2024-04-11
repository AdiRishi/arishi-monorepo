import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import clsx from 'clsx';
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes';
import { Layout } from '~/components/layouts/root-layout';
import tailwindStyles from '~/global-styles/tailwind.css?url';
import { themeSessionResolver } from '~/lib/theme.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStyles }];

export const loader = async (args: LoaderFunctionArgs) => {
  const themeStorage = await themeSessionResolver(args.request);
  const shouldRenderGA = process.env.NODE_ENV === 'production';
  return {
    theme: themeStorage.getTheme(),
    shouldRenderGA,
  };
};

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
        {data.shouldRenderGA && <script async src="https://www.googletagmanager.com/gtag/js?id=G-905KM3LRN9" />}
        {data.shouldRenderGA && (
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
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/session-actions/set-theme">
      <App />
    </ThemeProvider>
  );
}
