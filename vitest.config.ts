import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Minimal vitest config for the pure functions in `src/lib`.
 *
 * - `node` environment (the tested functions are dependency-free; no DOM).
 * - Resolves the `@/*` path alias to mirror tsconfig so test imports match app
 *   imports.
 *
 * Run with: `pnpm vitest run`
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
