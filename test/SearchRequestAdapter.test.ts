import { describe, expect, it } from 'vitest';
import { SearchRequestAdapter } from '../src/adapters/SearchRequestAdapter';
import type { FacetFilter, SearchRequest } from '../src/types';

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

  it('converts a bare string, a flat array and a nested array of facet filters', () => {
    const filters = (facetFilters: FacetFilter) => transform([createRequest({ facetFilters })])[0]?.filters;

    expect(filters('brand:Nike')).toEqual([{ key: 'brand', operator: 'in', values: ['Nike'] }]);
    expect(filters(['brand:Nike', 'color:red'])).toEqual([
      { key: 'brand', operator: 'in', values: ['Nike'] },
      { key: 'color', operator: 'in', values: ['red'] },
    ]);
    expect(filters([['brand:Nike', ['brand:Adidas', ['brand:Puma']]], 'color:red'])).toEqual([
      { key: 'brand', operator: 'in', values: ['Nike', 'Adidas', 'Puma'] },
      { key: 'color', operator: 'in', values: ['red'] },
    ]);
  });

  it('converts a bare string, a flat array and a nested array of numeric filters', () => {
    const filters = (numericFilters: FacetFilter) => transform([createRequest({ numericFilters })])[0]?.filters;

    expect(filters('price>=10')).toEqual([{ key: 'price', operator: 'gte', values: ['10'] }]);
    expect(filters(['price>=10', 'price<=50'])).toEqual([
      { key: 'price', operator: 'gte', values: ['10'] },
      { key: 'price', operator: 'lte', values: ['50'] },
    ]);
    expect(filters([['price>=10', ['price<=50']], 'stock=1'])).toEqual([
      { key: 'price', operator: 'gte', values: ['10'] },
      { key: 'price', operator: 'lte', values: ['50'] },
      { key: 'stock', operator: 'in', values: ['1'] },
    ]);
  });

  it('produces the same contexts as 2.0.0 for flat filters and one level of OR groups', () => {
    const contexts = transform(
      [
        createRequest({
          query: 'shirt',
          page: 1,
          hitsPerPage: 10,
          facets: ['brand', 'color'],
          facetFilters: ['brand:Nike', 'color:red'],
          numericFilters: ['price>=10', 'price<=50', 'stock=1'],
        }),
        {
          ...createRequest({
            facets: 'brand',
            facetFilters: [['brand:Nike', 'brand:Adidas'], 'color:red', ['size:M', 'size:L', 'color:blue']],
            numericFilters: ['price>10', 'price<50'],
          }),
          indexName: 'categories',
        },
      ],
      { threshold: 2 },
    );

    // Output of the 2.0.0 adapter for the same requests.
    expect(JSON.stringify(contexts)).toBe(
      '[{"facets":["brand","color"],"filters":[{"key":"brand","operator":"in","values":["Nike"]},{"key":"color","operator":"in","values":["red"]},{"key":"price","operator":"gte","values":["10"]},{"key":"price","operator":"lte","values":["50"]},{"key":"stock","operator":"in","values":["1"]}],"indices":["products"],"q":"shirt","threshold":2,"session_id":"session","user_id":"user","__queryID":"query","limit":10,"offset":10},{"facets":["brand"],"filters":[{"key":"brand","operator":"in","values":["Nike","Adidas"]},{"key":"color","operator":"in","values":["red"]},{"key":"size","operator":"in","values":["M","L"]},{"key":"price","operator":"gt","values":["10"]},{"key":"price","operator":"lt","values":["50"]}],"indices":["categories"],"threshold":2,"session_id":"session","user_id":"user","__queryID":"query","limit":10,"offset":0}]',
    );
  });
});
