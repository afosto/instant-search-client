# @afosto/instant-search-client

## 2.0.1

### Patch Changes

- [#19](https://github.com/afosto/instant-search-client/pull/19) Thanks [@Rapid0o](https://github.com/Rapid0o)! - Make the client assignable to InstantSearch's `SearchClient` with algoliasearch v5, so `searchClient={afostoInstantSearch(key)}` typechecks without a cast.

  - `facetFilters` and `numericFilters` accept a bare string and nested (readonly) arrays, both in the types and at runtime. Requests that worked in 2.0.0 are sent unchanged.
  - `facets` accepts a readonly array.
  - `searchForFacetValues()` resolves to `{ facetHits: [], exhaustiveFacetsCount: true }`.

## 2.0.0

### Major Changes

- [#17](https://github.com/afosto/instant-search-client/pull/17) [`2ea883b`](https://github.com/afosto/instant-search-client/commit/2ea883b0fd40957f30dc0c2a117a31f8ae7a960c) Thanks [@Rapid0o](https://github.com/Rapid0o)! - Rewrite the client in TypeScript and ship it as ESM only.

  - Type definitions are included, `AfostoInstantSearchOptions` and the other types can be imported from the package.
  - The CommonJS build (`dist/cjs`) is removed and the ESM build moved from `dist/esm/index.js` to `dist/index.js`. Import from `@afosto/instant-search-client` instead of a `dist` path. Node 22+ can still `require()` the package.
  - The browser build keeps its name (`dist/afosto-instant-search.min.js`) and still exposes `window.afostoInstantSearch`.
  - The browser build targets ES2020 (Chrome 80, Firefox 74, Safari 13.1 and later) and no longer includes polyfills.
  - `uuid-random` is no longer a dependency.
  - The default export is removed, use the named export: `import { afostoInstantSearch } from '@afosto/instant-search-client'`.
