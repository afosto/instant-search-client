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
      const searchContext = searchRequestAdapter.transform(requests, clientOptions);

      if (!clientOptions.allowEmptyQuery && !searchContext.q) {
        return searchResponseAdapter.transform({}, requests, clientOptions);
      }

      const response = await searchRequest(searchContext);
      return searchResponseAdapter.transform(response, requests, clientOptions);
    } catch (err) {
      return searchResponseAdapter.transform({}, requests, clientOptions);
    }
  };

  const searchForFacetValues = async () => ({});

  return {
    search,
    searchForFacetValues,
  };
};

export default afostoInstantSearch;
