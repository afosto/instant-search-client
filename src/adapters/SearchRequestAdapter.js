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
    return request?.params?.facets || [];
  };

  /**
   * Transform facet instant search filters to Afosto request filters.
   * @param {Array} filters
   * @returns {*}
   */
  const transformFacetFilters = filters => {
    return (filters || []).reduce((acc, facetFilters) => {
      const [filter] = facetFilters;
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
   * Transform the indices of the instant search requests to Afosto request indices.
   * @param {Array} requests
   * @returns {Array}
   */
  const transformIndices = requests => {
    return [...new Set(requests.map(request => request.indexName).filter(indexName => !!indexName))];
  };

  /**
   * Transform the pagination of the instant search request to Afosto request pagination.
   * @param {Object} request
   * @param {Object} options
   * @returns {{ offset: number, limit: (*|number) }}
   */
  const transformPagination = (request, options = {}) => {
    const { page, hitsPerPage } = request?.params ?? {};
    const offset = page * hitsPerPage;

    return { limit: hitsPerPage || options.hitsPerPage, offset };
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
    const [searchRequest] = requests || [];
    const facets = transformFacets(searchRequest);
    const filters = transformFilters(searchRequest);
    const indices = transformIndices(requests);
    const pagination = transformPagination(searchRequest, options);
    const query = transformQuery(searchRequest);

    return {
      facets,
      filters,
      indices,
      q: query,
      threshold: options.threshold || DEFAULT_OPTIONS.threshold,
      ...pagination,
    };
  };

  return { transform };
};

export default SearchRequestAdapter;
