import { DEFAULT_OPTIONS, MATCH_FILTER_REGEX, OPERATOR_CONVERSION } from '../constants';

/**
 * Transform instant search request context to Afosto request context.
 * @returns {Object}
 * @constructor
 */
const SearchRequestAdapter = () => {
  /**
   * Transform the instant search request facets to Afosto request facets.
   * @param request
   * @returns {Array}
   */
  const transformFacets = request => {
    const requestFacets = request?.params?.facets;

    if (requestFacets && typeof requestFacets === 'string') {
      return [requestFacets];
    }

    return requestFacets || [];
  };

  /**
   * Transform facet instant search filters to Afosto request filters.
   * @param {Array} filters
   * @returns {*}
   */
  const transformFacetFilters = filters => {
    return (filters || []).reduce((acc, facetFilters) => {
      let filter = facetFilters;

      if (Array.isArray(facetFilters)) {
        filter = facetFilters[0];
      }

      const [key, value] = filter?.split(':') ?? [];

      if (key && value) {
        return [...acc, { key, operator: 'in', values: [value] }];
      }

      return acc;
    }, []);
  };

  /**
   * Transform numeric instant search filters to Afosto request filters.
   * @param {Array} filters
   * @returns {*}
   */
  const transformNumericFilters = filters => {
    return (filters || []).reduce((acc, numericFilter) => {
      const matches = numericFilter.matchAll(MATCH_FILTER_REGEX);
      const [match] = [...matches];
      const [, key, operator, value] = match ?? [];
      const convertedOperator = OPERATOR_CONVERSION[operator];

      if (key && convertedOperator && value) {
        return [...acc, { key, operator: convertedOperator, values: [value] }];
      }

      return acc;
    }, []);
  };

  /**
   * Transform instant search request filters to Afosto request filters.
   * @param {Object} request
   * @returns {Array}
   */
  const transformFilters = request => {
    const params = request?.params ?? {};
    const facetFilters = transformFacetFilters(params.facetFilters);
    const numericFilters = transformNumericFilters(params.numericFilters);

    return [...facetFilters, ...numericFilters];
  };

  /**
   * Transform the pagination of the instant search request to Afosto request pagination.
   * @param {Object} request
   * @param {Object} options
   * @returns {{ offset: number, limit: (*|number) }}
   */
  const transformPagination = (request, options = {}) => {
    const { page, hitsPerPage } = request?.params ?? {};
    const limit = hitsPerPage || options.hitsPerPage;
    const offset = page * limit;

    return { limit, offset };
  };

  /**
   * Transform the instant search request query param to Afosto request query param.
   * @param {Object} request
   * @returns {String|undefined}
   */
  const transformQuery = request => {
    return request?.params?.query ?? request?.query;
  };

  /**
   * Transform the instant search requests context to Afosto request context.
   * @param {Array} requests
   * @param {Object} options
   * @returns {Object}
   */
  const transform = (requests, options = {}) => {
    return requests.reduce((acc, request) => {
      const facets = transformFacets(request);
      const filters = transformFilters(request);
      const pagination = transformPagination(request, options);
      const query = transformQuery(request);

      return [...acc, {
        facets,
        filters,
        indices: [request.indexName],
        q: query,
        threshold: options.threshold || DEFAULT_OPTIONS.threshold,
        session_id: request.session_id,
        __queryID: request.__queryID,
        ...pagination,
      }];
    }, []);
  };

  return { transform };
};

export default SearchRequestAdapter;
