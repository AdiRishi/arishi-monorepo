import { useEffect } from "react";

import { connectAgents } from "./agent";

// App-wide providers, such as theme or auth, go here. The router's `Wrap`
// option wraps every route in this component.
export function AppProviders({ children }: { readonly children: React.ReactNode }) {
  useEffect(connectAgents, []);
  return <>{children}</>;
}
