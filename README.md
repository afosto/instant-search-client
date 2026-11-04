<p align="center">
  <a href="https://afosto.com"><img src="https://content.afosto.io/5719193282412544/brand/AFO-Logo-compleet-kleur-RGBat4x.png?w=268" alt="Afosto" /></a>
</p>

<h1 align="center">Afosto Instant Search Client</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@afosto/instant-search-client"><img src="https://img.shields.io/npm/v/@afosto/instant-search-client.svg" alt="npm version"></a>
  <a href="https://github.com/afosto/instant-search-client/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
</p>

<p>
This library is an Afosto search client plugin for the open-source <a href="https://github.com/algolia/instantsearch.js">InstantSearch.js</a> library (powered by Algolia). With this plugin you can use the amazing widgets of the InstantSearch.js library, while communicating with the Afosto search API.
</p>
<br />
<img src="https://qcqcdn.com/afosto/instant_search_demo_page_7dd20c983c/instant_search_demo_page_7dd20c983c.gif">

> Don't want to implement your own UI? You can also try our [Afosto instant search widget](https://github.com/afosto/instant-search-widget).

## Installation

### Basic

```sh
# Install with pnpm
pnpm add @afosto/instant-search-client instantsearch.js

# Install with npm
npm install @afosto/instant-search-client instantsearch.js
```

### React

```sh
# Install with pnpm
pnpm add @afosto/instant-search-client react-instantsearch

# Install with npm
npm install @afosto/instant-search-client react-instantsearch
```

### Browser

This library supports the **last two** versions of major browsers (Chrome, Edge, Firefox, Safari).

```html
<script src="https://cdn.jsdelivr.net/npm/@afosto/instant-search-client@2/dist/afosto-instant-search.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4/dist/instantsearch.production.min.js"></script>
```

## Getting started

> To use the client you will need an Afosto search engine. Don't have one yet? Sign up on [Afosto.com](https://afosto.com/register/) and follow [the guides in our documentation](https://afosto.com/docs/apps/instant-search/).

First you initialize the Afosto search client with your **search engine key**. This search engine key can be found in the [Afosto app](https://afosto.app/).

### ES modules

```js
import { afostoInstantSearch } from '@afosto/instant-search-client';

const client = afostoInstantSearch('my-search-engine-key');
```

The package is ESM only. Node 22+ can still `require()` it.

### TypeScript

The package ships its own type definitions, no extra `@types` package is needed.

```ts
import { afostoInstantSearch, type AfostoInstantSearchOptions } from '@afosto/instant-search-client';

const options: AfostoInstantSearchOptions = { hitsPerPage: 20 };
const client = afostoInstantSearch('my-search-engine-key', options);
```

### Browser

```js
const client = afostoInstantSearch('my-search-engine-key');
```

## Usage

**Note:** This library is a client for **InstantSearch.js** it does not contain any UI components by itself. You can use it with the InstantSearch.js library as shown below:

### Basic

```js
const client = afostoInstantSearch('my-search-engine-key');
const search = instantsearch({
  indexName: 'my-index',
  searchClient: client,
});

search.start();
```

For more information check the InstantSearch.js [documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/).

### Basic with settings

```js
const client = afostoInstantSearch('my-search-engine-key');

async function initSearch() {
  const settings = await client.getSettings();
  const [firstIndex] = settings.indexes || [];

  const search = instantsearch({
    indexName: firstIndex.alias,
    searchClient: client,
  });

  // Do something with the settings.
  // For example render filters dynamically.

  search.start();
}

initSearch();
```

### React

You can use the initialized Afosto client with the [React InstantSearch](https://github.com/algolia/react-instantsearch) library.

```js
import { afostoInstantSearch } from '@afosto/instant-search-client';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';

const searchClient = afostoInstantSearch('my-search-engine-key');

const App = () => (
  <InstantSearch searchClient={searchClient} indexName="my-index">
    <SearchBox />
    <Hits />
  </InstantSearch>
);
```

For more information check the React InstantSearch [documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/).

## Compatibility

- InstantSearch.js v4
- Node >= 22

## Upgrading from 1.x

- The package is ESM only, the CommonJS build (`dist/cjs`) is removed. Bundlers and Node 22+ handle this without changes.
- The ESM build moved from `dist/esm/index.js` to `dist/index.js`. Import from `@afosto/instant-search-client` instead of a `dist` path.
- The browser build keeps its name (`dist/afosto-instant-search.min.js`) and still exposes `window.afostoInstantSearch`.
- `uuid-random` is no longer a dependency.

## Development

```sh
pnpm install
pnpm dev        # Playground on http://localhost:5173
pnpm test       # Unit tests (Vitest)
pnpm lint       # oxlint
pnpm format     # oxfmt
pnpm typecheck  # TypeScript
pnpm build      # dist/ (ESM, type definitions and the browser build)
```

### Pull requests

Name your branch `Type/short-description`, with `Type` one of `Feature`, `Fix`, `Chore`, `Refactor`, `Docs`, `Test` or `CI`, for example `Fix/keep-query-session`. The PR title is set to the branch name automatically, and PRs are squash merged, so that title becomes the commit on `master`.

### Releasing

Releases are managed with [changesets](https://github.com/changesets/changesets).

1. Run `pnpm changeset` in your PR, pick the version bump and describe the change.
2. After merging to `master`, a "Version Packages" PR is opened that bumps the version and updates the `CHANGELOG.md`.
3. Merging that PR publishes the new version to npm and creates the GitHub release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/afosto/instant-search-client/blob/master/LICENSE).
