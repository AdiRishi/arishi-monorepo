import { env } from "cloudflare:workers";

const apiOrigin = "https://api.internal";

export const fetchApi = (path: string, init?: RequestInit) =>
  env.API.fetch(new Request(new URL(path, apiOrigin), init));
