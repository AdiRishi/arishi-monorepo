import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { createThemeSessionResolver } from 'remix-themes';

const isProduction = process.env.NODE_ENV === 'production';

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_remix_themes',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: ['s3cr3t'],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: 'adishwar-rishi.com', secure: true } : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeSessionStorage);
