export const DEFAULT_OPTIONS = {
  allowEmptyQuery: true,
  baseUrl: 'https://afosto.app/api/instant/search/{key}',
  hitsPerPage: 10,
  requestOptions: {},
  settingsRequestOptions: {},
  threshold: 1,
  transformContext: data => data,
  transformResponse: data => data,
};

export const MATCH_FILTER_REGEX = /(?<key>[\w'-]+)(?<operator>>=|>|<|<=|=)(?<value>\d+)/g;

export const OPERATOR_CONVERSION = {
  '>=': 'gte',
  '>': 'gt',
  '<': 'lt',
  '<=': 'lte',
  '=': 'in',
};

export const USER_SESSION_KEY = 'afostoInstantSearch_userSessionID';
