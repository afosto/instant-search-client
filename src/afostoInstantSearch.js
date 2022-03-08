import { SearchResponseAdapter, SearchRequestAdapter } from './adapters';
import { DEFAULT_OPTIONS } from './constants';

/**
 * Afosto instant search client
 * @param {String} searchEngineKey
 * @param {Object} options
 * @returns {Object}
 * @constructor
 */
const afostoInstantSearch = (searchEngineKey, options = {}) => {
  if (!searchEngineKey) {
    throw new Error('A search engine key is required to use the Afosto instant search client.')
  }

  const clientOptions = { ...DEFAULT_OPTIONS, ...(options ?? {}) };
  const url = clientOptions.baseUrl?.replace('{key}', searchEngineKey);
  const searchRequestAdapter = SearchRequestAdapter();
  const searchResponseAdapter = SearchResponseAdapter();

  const getSettings = async () => {
    try {
      const settingsRequestOptions = clientOptions.settingsRequestOptions || {};
      const settingsResponse = await fetch(`${url}/settings`, {
        ...settingsRequestOptions,
        method: 'GET',
      });
      const response = await settingsResponse.json();

      return response.data;
    } catch (error) {
      return {};
    }
  };

  const searchRequest = async context => {
    const requestOptions = clientOptions.requestOptions || {};
    const hasContextFormatter = clientOptions.transformContext && typeof clientOptions.transformContext === 'function';
    const hasResponseFormatter = clientOptions.transformResponse && typeof clientOptions.transformResponse === 'function';
    const payload = hasContextFormatter ? clientOptions.transformContext(context) : context;
    const searchResponse = await fetch(url, {
      ...requestOptions,
      method: 'POST',
      headers: {
        Accept: 'application/vnd.instantsearch+json',
        ...(requestOptions.headers || {}),
      },
      body: JSON.stringify({ data: payload }),
    });
    const response = await searchResponse.json();

    return hasResponseFormatter ? clientOptions.transformResponse(response) : response;
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
    getSettings,
    search,
    searchForFacetValues,
  };
};

export default afostoInstantSearch;
