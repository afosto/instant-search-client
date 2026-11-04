import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: 'esm',
    platform: 'neutral',
    target: 'es2020',
    dts: true,
    sourcemap: true,
  },
  {
    // Script tag build, exposes `window.afostoInstantSearch`.
    entry: { 'afosto-instant-search.min': 'src/browser.ts' },
    format: 'iife',
    globalName: 'afostoInstantSearch',
    platform: 'browser',
    target: 'es2020',
    minify: true,
    // Keep the file name of 1.x, so existing CDN urls keep working.
    outputOptions: { entryFileNames: '[name].js' },
  },
]);
