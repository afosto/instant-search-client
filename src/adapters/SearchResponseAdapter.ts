import type {
  AfostoIndexResult,
  AfostoInstantSearchOptions,
  AfostoSearchResponse,
  InstantSearchRequest,
  InstantSearchResult,
} from '../types';

export interface SearchResponseAdapterInstance {
  transform: (
    response: AfostoSearchResponse | undefined,
    request: InstantSearchRequest,
    options?: AfostoInstantSearchOptions,
  ) => InstantSearchResult;
}

/**
 * Transform Afosto request response to instant search request response.
 * @returns {Object}
 * @constructor
 */
export const SearchResponseAdapter = (): SearchResponseAdapterInstance => {
  /**
   * Transform the Afosto index results to instant search request results.
   * @param {Object} results
   * @param {Object} request
   * @param {Object} options
   * @returns {Object}
   */
  const transformIndexResults = (
    results: Partial<AfostoIndexResult>,
    request: InstantSearchRequest,
    options: AfostoInstantSearchOptions = {},
  ): InstantSearchResult => {
    const params = request?.params || {};
    const page = params.page as number;
    const hitsPerPage = (params.hitsPerPage ?? options.hitsPerPage) as number;
    const query = (params.query ?? request?.query) as string;
    const hits = results.hits ?? [];
    const facets = results.facets ?? {};
    const facetsStats = results.facets_stats ?? {};
    const nbHits = results.count ?? 0;
    const nbPages = Math.ceil(nbHits / hitsPerPage);
    const index = results.id ?? request?.indexName;
    const queryID = results.__queryID ?? index;

    return {
      facets,
      facets_stats: facetsStats,
      hits,
      hitsPerPage,
      index,
      nbHits,
      nbPages,
      page,
      query,
      queryID,
      renderingContent: {
        facetOrdering: {
          facets: {
            order: Object.keys(facets),
          },
        },
      },
    };
  };

  /**
   * Transform Afosto request response to instant search results.
   * @param {Object} response
   * @param {Object} request
   * @param {Object} options
   * @returns {Object}
   */
  const transform = (
    response: AfostoSearchResponse | undefined,
    request: InstantSearchRequest,
    options: AfostoInstantSearchOptions = {},
  ): InstantSearchResult => {
    const results = (response?.results ?? []).reduce<Record<string, AfostoIndexResult>>((acc, result) => {
      return {
        ...acc,
        [result.id]: {
          ...result,
          facets: result.facets ?? {},
        },
      };
    }, {});
    const { indexName } = request ?? {};
    const indexResults = results[indexName] || {};

    return transformIndexResults(indexResults, request, options);
  };

  return { transform };
};
