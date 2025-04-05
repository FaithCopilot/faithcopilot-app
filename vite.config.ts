import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    include: ['**/*.{test,spec}.{js,ts}']
  },
  plugins: [tsconfigPaths()],
});
