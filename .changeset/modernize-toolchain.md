---
'@afosto/instant-search-client': major
---

Rewrite the client in TypeScript and ship it as ESM only.

- Type definitions are included, `AfostoInstantSearchOptions` and the other types can be imported from the package.
- The CommonJS build (`dist/cjs`) is removed and the ESM build moved from `dist/esm/index.js` to `dist/index.js`. Import from `@afosto/instant-search-client` instead of a `dist` path. Node 22+ can still `require()` the package.
- The browser build keeps its name (`dist/afosto-instant-search.min.js`) and still exposes `window.afostoInstantSearch`.
- The browser build targets ES2020 (Chrome 80, Firefox 74, Safari 13.1 and later) and no longer includes polyfills.
- `uuid-random` is no longer a dependency.
- The default export is removed, use the named export: `import { afostoInstantSearch } from '@afosto/instant-search-client'`.
