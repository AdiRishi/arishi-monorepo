import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/*.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["tests/integration/*.test.ts"],
          // Alchemy registers its cleanup after our destroy hook. Run hooks in
          // registration order so destroy(Stack) can still use the local runtime.
          sequence: { hooks: "list" },
          fileParallelism: false,
        },
      },
    ],
  },
});
