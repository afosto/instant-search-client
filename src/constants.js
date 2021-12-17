export const DEFAULT_OPTIONS = {
  allowEmptyQuery: true,
  hitsPerPage: 10,
  threshold: 1,
};

export const MATCH_FILTER_REGEX = /(?<key>\w+)(?<operator>>=|>|<|<=|=)(?<value>\d+)/g;

export const OPERATOR_CONVERSION = {
  '>=': 'gte',
  '>': 'gt',
  '<': 'lt',
  '<=': 'lte',
  '=': 'in',
};
