import { defineConfig } from "blume";

import { name } from "./package.json";

export default defineConfig({
  title: name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" "),
  description: "Develop, test, and deploy the application platform.",
  theme: {
    accent: { light: "#0f766e", dark: "#2dd4bf" },
    mode: "system",
  },
});
