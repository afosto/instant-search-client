import { describe, expect, it } from 'vitest';
import SearchRequestAdapter from '../src/adapters/SearchRequestAdapter';
import type { SearchRequest } from '../src/types';

const createRequest = (params: SearchRequest['params'] = {}): SearchRequest => ({
  indexName: 'products',
  params,
  session_id: 'session',
  user_id: 'user',
  __queryID: 'query',
});

describe('SearchRequestAdapter', () => {
  const { transform } = SearchRequestAdapter();

  it('transforms a request into a search context', () => {
    const [context] = transform([createRequest({ query: 'shirt', page: 2, hitsPerPage: 20, facets: 'brand' })]);

    expect(context).toEqual({
      facets: ['brand'],
      filters: [],
      indices: ['products'],
      q: 'shirt',
      threshold: 1,
      session_id: 'session',
      user_id: 'user',
      __queryID: 'query',
      limit: 20,
      offset: 40,
    });
  });

  it('falls back to the hitsPerPage option', () => {
    const [context] = transform([createRequest({ page: 1 })], { hitsPerPage: 5 });

    expect(context).toMatchObject({ limit: 5, offset: 5 });
  });

  it('sends every OR-ed facet value in one "in" filter', () => {
    const [context] = transform([createRequest({ facetFilters: [['brand:Nike', 'brand:Adidas'], 'color:red'] })]);

    expect(context?.filters).toEqual([
      { key: 'brand', operator: 'in', values: ['Nike', 'Adidas'] },
      { key: 'color', operator: 'in', values: ['red'] },
    ]);
  });

  it('converts numeric filters', () => {
    const [context] = transform([createRequest({ numericFilters: ['price>=10', 'price<=50', 'stock=1'] })]);

    expect(context?.filters).toEqual([
      { key: 'price', operator: 'gte', values: ['10'] },
      { key: 'price', operator: 'lte', values: ['50'] },
      { key: 'stock', operator: 'in', values: ['1'] },
    ]);
  });
});
