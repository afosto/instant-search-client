import type { AfostoInstantSearchOptions, FilterOperator } from './types';

export const DEFAULT_OPTIONS: Required<AfostoInstantSearchOptions> = {
  allowEmptyQuery: true,
  baseUrl: 'https://afosto.app/api/instant/search/{key}',
  hitsPerPage: 10,
  requestOptions: {},
  settingsRequestOptions: {},
  threshold: 1,
  transformContext: data => data,
  transformResponse: data => data,
};

export const MATCH_FILTER_REGEX: RegExp = /(?<key>[\w'-]+)(?<operator>>=|>|<|<=|=)(?<value>\d+)/g;

export const OPERATOR_CONVERSION: Record<string, FilterOperator> = {
  '>=': 'gte',
  '>': 'gt',
  '<': 'lt',
  '<=': 'lte',
  '=': 'in',
};

export const USER_SESSION_KEY = 'afostoInstantSearch_userSessionID';
