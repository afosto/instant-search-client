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
    const nbPages = Math.floor(nbHits / hitsPerPage);
    const index = results.id ?? request?.indexName;

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
      queryID: index,
    };
  };

  /**
   * Transform the Afosto response to responses for each instant search request.
   * @param {Object} response
   * @param {Array} requests
   * @param {Object} options
   * @returns {Array}
   */
  const transformResults = (response, requests, options = {}) => {
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

    return requests.reduce((acc, request) => {
      const { indexName } = request ?? {};
      const indexResults = results[indexName] || {};

      return [...acc, transformIndexResults(indexResults, request, options)];
    }, []);
  };

  /**
   * Transform Afosto request response to instant search results.
   * @param {Object} response
   * @param {Array} requests
   * @param {Object} options
   * @returns {Object}
   */
  const transform = (response, requests, options = {}) => {
    const results = transformResults(response, requests, options);
    return { results };
  };

  return { transform };
};

export default SearchResponseAdapter;
