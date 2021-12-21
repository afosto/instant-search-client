import { SearchResponseAdapter, SearchRequestAdapter } from './adapters';
import { DEFAULT_OPTIONS } from './constants';

/**
 * Afosto instant search client
 * @param {String} proxyId
 * @param {Object} options
 * @returns {Object}
 * @constructor
 */
const afostoInstantSearch = (proxyId, options) => {
  if (!proxyId) {
    throw new Error('A proxyId is required to use the Afosto instant search client.')
  }

  const clientOptions = { ...DEFAULT_OPTIONS, ...(options ?? {}) };
  const searchRequestAdapter = SearchRequestAdapter();
  const searchResponseAdapter = SearchResponseAdapter();

  const searchRequest = async context => {
    const searchResponse = await fetch(`https://api.afosto.io/cnt/instant/search/${proxyId}`, {
      headers: {
        Accept: 'application/vnd.instantsearch+json',
      },
      method: 'POST',
      body: JSON.stringify(context),
    });

    return searchResponse.json();
  }

  const search = async requests => {
    try {
      const searchContexts = searchRequestAdapter.transform(requests, clientOptions);
      const [searchRequestContext] = searchContexts;

      if (!clientOptions.allowEmptyQuery && !searchRequestContext?.q) {
        return searchResponseAdapter.transform({}, requests, clientOptions);
      }

      const promises = searchContexts.map(context => searchRequest(context));
      const responses = await Promise.allSettled(promises);
      const responseValues = responses.map(response => response.value || {});

      const results = requests.reduce((acc, request, idx) => {
        const response = searchResponseAdapter.transform(responseValues[idx], request, clientOptions);
        return [...acc, response];
      }, []);

      return { results };
    } catch (err) {
      return searchResponseAdapter.transform({}, requests, clientOptions);
    }
  };

  const searchForFacetValues = async () => {
    console.warn("The Afosto instant search client currently doesn't support searching for facet values");
    return { facetHits: [] };
  }

  return {
    search,
    searchForFacetValues,
  };
};

export default afostoInstantSearch;
