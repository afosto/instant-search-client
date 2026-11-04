import { SearchResponseAdapter, SearchRequestAdapter } from './adapters';
import { DEFAULT_OPTIONS } from './constants';
import type {
  AfostoInstantSearchClient,
  AfostoInstantSearchOptions,
  AfostoSearchResponse,
  AfostoSettings,
  InstantSearchRequest,
  InstantSearchResult,
  SearchContext,
  SearchRequest,
} from './types';
import getUserID from './utils/getUserID';
import uuid from './utils/uuid';

/**
 * Afosto instant search client
 * @param {String} searchEngineKey
 * @param {Object} options
 * @returns {Object}
 * @constructor
 */
const afostoInstantSearch = (
  searchEngineKey: string,
  options: AfostoInstantSearchOptions = {},
): AfostoInstantSearchClient => {
  if (!searchEngineKey) {
    throw new Error('A search engine key is required to use the Afosto instant search client.');
  }

  const clientOptions: AfostoInstantSearchOptions = { ...DEFAULT_OPTIONS, ...options };
  const url = clientOptions.baseUrl?.replace('{key}', searchEngineKey) ?? '';
  const searchRequestAdapter = SearchRequestAdapter();
  const searchResponseAdapter = SearchResponseAdapter();
  const userID = getUserID();
  const searchQueryState: { querySessionID: string | null; query: string | undefined } = {
    querySessionID: null,
    query: undefined,
  };

  const getSettings = async (): Promise<AfostoSettings> => {
    try {
      const settingsRequestOptions = clientOptions.settingsRequestOptions || {};
      const settingsResponse = await fetch(`${url}/settings`, {
        ...settingsRequestOptions,
        method: 'GET',
      });
      const response = await settingsResponse.json();

      return response.data || {};
    } catch {
      return {};
    }
  };

  const setSearchQueryState = (requests: readonly InstantSearchRequest[]): void => {
    const [firstRequest] = requests || [];
    const { query } = firstRequest?.params || {};
    const searchQuery = query || firstRequest?.query;
    const lastQuery = searchQueryState.query;
    const querySessionID = searchQueryState.querySessionID;
    const isNewQuery =
      !querySessionID ||
      (!!lastQuery &&
        (!searchQuery?.length || searchQuery?.length === 1) &&
        searchQuery?.charAt(0) !== lastQuery?.charAt(0));

    if (isNewQuery) {
      searchQueryState.querySessionID = uuid();
    }

    searchQueryState.query = searchQuery;
  };

  const searchRequest = async (contexts: SearchContext[]): Promise<AfostoSearchResponse[]> => {
    const requestOptions = clientOptions.requestOptions || {};
    const { transformContext, transformResponse } = clientOptions;
    const hasContextFormatter = typeof transformContext === 'function';
    const hasResponseFormatter = typeof transformResponse === 'function';
    const payload = hasContextFormatter ? contexts.map(context => transformContext(context)) : contexts;
    const searchResponse = await fetch(url, {
      ...requestOptions,
      method: 'POST',
      headers: {
        Accept: 'application/vnd.instantsearch+json',
        ...requestOptions.headers,
      },
      body: JSON.stringify({ data: payload }),
    });
    const responses = await searchResponse.json();
    const formattedResponses: AfostoSearchResponse[] = Array.isArray(responses) ? responses : [responses];

    return hasResponseFormatter ? formattedResponses.map(response => transformResponse(response)) : formattedResponses;
  };

  const search = async (requests: readonly InstantSearchRequest[]): Promise<{ results: InstantSearchResult[] }> => {
    setSearchQueryState(requests);

    const searchRequests: SearchRequest[] = requests.map(request => ({
      ...request,
      session_id: searchQueryState.querySessionID,
      user_id: userID,
      __queryID: uuid(),
    }));
    const searchContexts = searchRequestAdapter.transform(searchRequests, clientOptions);
    const [searchRequestContext] = searchContexts;

    if (!clientOptions.allowEmptyQuery && !searchRequestContext?.q) {
      const results = searchRequests.map(request => searchResponseAdapter.transform({}, request, clientOptions));

      return { results };
    }

    const responses = await searchRequest(searchContexts);
    const results = searchRequests.reduce<InstantSearchResult[]>((acc, request) => {
      const response = responses.find(value => value.__queryID === request.__queryID);
      const result = searchResponseAdapter.transform(response, request, clientOptions);
      return [...acc, result];
    }, []);

    return { results };
  };

  const searchForFacetValues = async (): Promise<{ facetHits: [] }> => {
    console.warn("The Afosto instant search client currently doesn't support searching for facet values");
    return { facetHits: [] };
  };

  return {
    getSettings,
    search,
    searchForFacetValues,
  };
};

export default afostoInstantSearch;
