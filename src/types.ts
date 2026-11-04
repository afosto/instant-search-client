export type RequestOptions = Omit<RequestInit, 'headers' | 'method' | 'body'> & {
  headers?: Record<string, string>;
};

export interface AfostoInstantSearchOptions {
  /** Send a search request when the query is empty. */
  allowEmptyQuery?: boolean;
  /** The search API url, `{key}` is replaced with the search engine key. */
  baseUrl?: string;
  /** Fallback for requests without a `hitsPerPage` param. */
  hitsPerPage?: number;
  /** Extra fetch options for the search request. */
  requestOptions?: RequestOptions;
  /** Extra fetch options for the settings request. */
  settingsRequestOptions?: RequestOptions;
  threshold?: number;
  /** Transform every search context before it is sent to the API. */
  transformContext?: (context: SearchContext) => unknown;
  /** Transform every API response before it is converted to an InstantSearch result. */
  transformResponse?: (response: AfostoSearchResponse) => AfostoSearchResponse;
}

export type FacetFilter = string | string[];

export interface InstantSearchRequestParams {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  facets?: string | string[];
  facetFilters?: FacetFilter[];
  numericFilters?: string[];
  [key: string]: unknown;
}

export interface InstantSearchRequest {
  indexName: string;
  query?: string;
  params?: InstantSearchRequestParams;
}

export interface SearchRequest extends InstantSearchRequest {
  session_id: string | null;
  user_id: string;
  __queryID: string;
}

export type FilterOperator = 'in' | 'gte' | 'gt' | 'lt' | 'lte';

export interface SearchFilter {
  key: string;
  operator: FilterOperator;
  values: string[];
}

export interface SearchContext {
  facets: string[];
  filters: SearchFilter[];
  indices: string[];
  q: string | undefined;
  threshold: number;
  session_id: string | null;
  user_id: string;
  __queryID: string;
  limit: number;
  offset: number;
}

export interface AfostoIndexResult {
  id: string;
  hits?: Record<string, unknown>[];
  facets?: Record<string, Record<string, number>>;
  facets_stats?: Record<string, { min: number; max: number; avg?: number; sum?: number }>;
  count?: number;
  __queryID?: string;
}

export interface AfostoSearchResponse {
  __queryID?: string;
  results?: AfostoIndexResult[];
}

export interface InstantSearchResult {
  facets: Record<string, Record<string, number>>;
  facets_stats: Record<string, { min: number; max: number; avg?: number; sum?: number }>;
  hits: Record<string, unknown>[];
  hitsPerPage: number;
  index: string;
  nbHits: number;
  nbPages: number;
  page: number;
  query: string;
  queryID: string;
  renderingContent: {
    facetOrdering: {
      facets: {
        order: string[];
      };
    };
  };
}

export interface AfostoIndexSettings {
  alias: string;
  filters?: { key: string; [key: string]: unknown }[];
  [key: string]: unknown;
}

export interface AfostoSettings {
  indexes?: AfostoIndexSettings[];
  [key: string]: unknown;
}

export interface AfostoInstantSearchClient {
  getSettings: () => Promise<AfostoSettings>;
  search: (requests: readonly InstantSearchRequest[]) => Promise<{ results: InstantSearchResult[] }>;
  searchForFacetValues: () => Promise<{ facetHits: [] }>;
}
