/**
 * Transform Afosto request response to instant search request response.
 * @returns {Object}
 * @constructor
 */
const SearchResponseAdapter = () => {
  /**
   * Transform the Afosto index results to instant search request results.
   * @param {Object} results
   * @param {Object} request
   * @param {Object} options
   * @returns {Object}
   */
  const transformIndexResults = (results, request, options = {}) => {
    const params = request?.params || {};
    const { page } = params;
    const hitsPerPage = params.hitsPerPage ?? options.hitsPerPage;
    const query = params.query ?? request?.query;
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
        }
      }
    };
  };

  /**
   * Transform Afosto request response to instant search results.
   * @param {Object} response
   * @param {Object} request
   * @param {Object} options
   * @returns {Object}
   */
  const transform = (response, request, options = {}) => {
    const results = (response?.results ?? []).reduce(
      (acc, result) => {
        return {
          ...acc,
          [result.id]: {
            ...result,
            facets: result.facets ?? {}
          },
        };
      },
      {},
    );
    const { indexName } = request ?? {};
    const indexResults = results[indexName] || {};

    return transformIndexResults(indexResults, request, options);
  };

  return { transform };
};

export default SearchResponseAdapter;
