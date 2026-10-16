// App-wide providers, such as theme or auth, go here. The router's `Wrap`
// option wraps every route in this component.
export function AppProviders({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}
