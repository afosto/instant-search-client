import { DEFAULT_OPTIONS, MATCH_FILTER_REGEX, OPERATOR_CONVERSION } from '../constants';
import type {
  AfostoInstantSearchOptions,
  FacetFilter,
  InstantSearchRequest,
  SearchContext,
  SearchFilter,
  SearchRequest,
} from '../types';

export interface SearchRequestAdapterInstance {
  transform: (requests: SearchRequest[], options?: AfostoInstantSearchOptions) => SearchContext[];
}

/**
 * Transform instant search request context to Afosto request context.
 * @returns {Object}
 * @constructor
 */
const SearchRequestAdapter = (): SearchRequestAdapterInstance => {
  /**
   * Transform the instant search request facets to Afosto request facets.
   * @param request
   * @returns {Array}
   */
  const transformFacets = (request: InstantSearchRequest): string[] => {
    const requestFacets = request?.params?.facets;

    if (requestFacets && typeof requestFacets === 'string') {
      return [requestFacets];
    }

    return (requestFacets as string[] | undefined) || [];
  };

  /**
   * Transform facet instant search filters to Afosto request filters.
   * The values of a nested array are OR-ed by InstantSearch, so they become one "in" filter.
   * @param {Array} filters
   * @returns {Array}
   */
  const transformFacetFilters = (filters: FacetFilter[] | undefined): SearchFilter[] => {
    return (filters || []).reduce<SearchFilter[]>((acc, facetFilters) => {
      const group = Array.isArray(facetFilters) ? facetFilters : [facetFilters];
      const [key] = group[0]?.split(':') ?? [];
      const values = group.reduce<string[]>((groupValues, filter) => {
        const [filterKey, value] = filter?.split(':') ?? [];

        if (filterKey === key && value) {
          return [...groupValues, value];
        }

        return groupValues;
      }, []);

      if (key && values.length) {
        return [...acc, { key, operator: 'in', values }];
      }

      return acc;
    }, []);
  };

  /**
   * Transform numeric instant search filters to Afosto request filters.
   * @param {Array} filters
   * @returns {Array}
   */
  const transformNumericFilters = (filters: string[] | undefined): SearchFilter[] => {
    return (filters || []).reduce<SearchFilter[]>((acc, numericFilter) => {
      const matches = numericFilter.matchAll(MATCH_FILTER_REGEX);
      const [match] = [...matches];
      const [, key, operator, value] = match ?? [];
      const convertedOperator = operator ? OPERATOR_CONVERSION[operator] : undefined;

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
  const transformFilters = (request: InstantSearchRequest): SearchFilter[] => {
    const params = request?.params ?? {};
    const facetFilters = transformFacetFilters(params.facetFilters);
    const numericFilters = transformNumericFilters(params.numericFilters);

    return [...facetFilters, ...numericFilters];
  };

  /**
   * Transform the pagination of the instant search request to Afosto request pagination.
   * @param {Object} request
   * @param {Object} options
   * @returns {{ offset: number, limit: number }}
   */
  const transformPagination = (
    request: InstantSearchRequest,
    options: AfostoInstantSearchOptions = {},
  ): { limit: number; offset: number } => {
    const { page, hitsPerPage } = request?.params ?? {};
    const limit = hitsPerPage || options.hitsPerPage || DEFAULT_OPTIONS.hitsPerPage;
    const offset = (page ?? 0) * limit;

    return { limit, offset };
  };

  /**
   * Transform the instant search request query param to Afosto request query param.
   * @param {Object} request
   * @returns {String|undefined}
   */
  const transformQuery = (request: InstantSearchRequest): string | undefined => {
    return request?.params?.query ?? request?.query;
  };

  /**
   * Transform the instant search requests context to Afosto request context.
   * @param {Array} requests
   * @param {Object} options
   * @returns {Array}
   */
  const transform = (requests: SearchRequest[], options: AfostoInstantSearchOptions = {}): SearchContext[] => {
    return requests.reduce<SearchContext[]>((acc, request) => {
      const facets = transformFacets(request);
      const filters = transformFilters(request);
      const pagination = transformPagination(request, options);
      const query = transformQuery(request);

      return [
        ...acc,
        {
          facets,
          filters,
          indices: [request.indexName],
          q: query,
          threshold: options.threshold || DEFAULT_OPTIONS.threshold,
          session_id: request.session_id,
          user_id: request.user_id,
          __queryID: request.__queryID,
          ...pagination,
        },
      ];
    }, []);
  };

  return { transform };
};

export default SearchRequestAdapter;
