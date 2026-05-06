import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/hostinly-backend/products',
  test: {
    name: '@org/products',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/hostinly-backend/products',
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
