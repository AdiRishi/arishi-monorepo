import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

export function App() {
  return (
    <main>
      <h1>Adishwar Rishi</h1>
    </main>
  );
}
