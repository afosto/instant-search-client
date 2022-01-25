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

## Installation

### Basic

```sh
# Install with Yarn
yarn add @afosto/instant-search-client instantsearch.js

# Install with NPM
npm install @afosto/instant-search-client instantsearch.js
```

### React

```sh
# Install with Yarn
yarn add @afosto/instant-search-client react-instantsearch-dom

# Install with NPM
npm install @afosto/instant-search-client react-instantsearch-dom
```


### Browser

This library supports the **last two** versions of major browsers (Chrome, Edge, Firefox, Safari).

```html
<script src="https://cdn.jsdelivr.net/npm/@afosto/instant-search-client@latest/dist/afosto-instant-search.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4/dist/instantsearch.production.min.js"></script>
```

## Getting started

First you initialize the Afosto search client with your **search engine key**. This search engine key can be found in the Afosto app.

### ES6

```js
import { afostoInstantSearch } from '@afosto/instant-search-client';

const client = afostoInstantSearch('my-search-engine-key');
```

### CJS

```js
const { afostoInstantSearch } = require('@afosto/instant-search-client');

const client = afostoInstantSearch('my-search-engine-key');
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

### React

You can use the initialized Afosto client with the [React InstantSearch](https://github.com/algolia/react-instantsearch) library.

```js
import { afostoInstantSearch } from '@afosto/instant-search-client';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

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
- Node >= 14

## License

This project is licensed under the terms of the [MIT license](https://github.com/afosto/instant-search-client/blob/master/LICENSE).
