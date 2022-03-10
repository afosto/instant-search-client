import { v4 as uuid } from 'uuid';
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

  const searchRequest = async contexts => {
    const requestOptions = clientOptions.requestOptions || {};
    const hasContextFormatter = clientOptions.transformContext && typeof clientOptions.transformContext === 'function';
    const hasResponseFormatter = clientOptions.transformResponse && typeof clientOptions.transformResponse === 'function';
    const payload = hasContextFormatter ? contexts.map(context => clientOptions.transformContext(context)) : contexts;
    const searchResponse = await fetch(url, {
      ...requestOptions,
      method: 'POST',
      headers: {
        Accept: 'application/vnd.instantsearch+json',
        ...(requestOptions.headers || {}),
      },
      body: JSON.stringify({ data: payload }),
    });
    const responses = await searchResponse.json();
    const formattedResponses = Array.isArray(responses) ? responses: [responses];

    return hasResponseFormatter ? formattedResponses.map(response => clientOptions.transformResponse(response)) : formattedResponses;
  }

  const search = async requests => {
    try {
      const searchRequests = requests.map(request => ({ ...request, __queryID: uuid() }));
      const searchContexts = searchRequestAdapter.transform(searchRequests, clientOptions);
      const [searchRequestContext] = searchContexts;

      if (!clientOptions.allowEmptyQuery && !searchRequestContext?.q) {
        return searchResponseAdapter.transform({}, searchRequests, clientOptions);
      }

      const responses = await searchRequest(searchContexts);
      const results = searchRequests.reduce((acc, request) => {
        const response = responses.find(value => value.__queryID === request.__queryID);
        const result = searchResponseAdapter.transform(response, request, clientOptions);
        return [...acc, result];
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
