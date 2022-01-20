export const DEFAULT_OPTIONS = {
  allowEmptyQuery: true,
  baseUrl: 'https://api.afosto.io/cnt/instant/search/{proxyId}',
  hitsPerPage: 10,
  requestOptions: {},
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
