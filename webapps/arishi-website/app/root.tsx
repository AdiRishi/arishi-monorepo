import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from 'react-router';
import { UnhandledError } from '~/components/page-layout/unhandled-error-page';
import './global-styles/tailwind.css';
import { Layout as RootLayout } from './layouts/root-layout';

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <UnhandledError title={error.statusText} statusCode={error.status} description={JSON.stringify(error.data)} />
    );
  } else if (error instanceof Error) {
    return <UnhandledError title="Something unexpected happened" statusCode={500} description={error.message} />;
  } else {
    return (
      <UnhandledError title="Something unexpected happened" statusCode={500} description={JSON.stringify(error)} />
    );
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
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
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
