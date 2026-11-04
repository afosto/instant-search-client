import { describe, expect, it } from 'vitest';
import { SearchResponseAdapter } from '../src/adapters/SearchResponseAdapter';

describe('SearchResponseAdapter', () => {
  const { transform } = SearchResponseAdapter();
  const request = { indexName: 'products', params: { query: 'shirt', page: 0, hitsPerPage: 10 } };

  it('transforms the result of the requested index', () => {
    const result = transform(
      {
        results: [
          { id: 'other', count: 99 },
          { id: 'products', count: 25, hits: [{ objectID: '1' }], facets: { brand: { Nike: 3 } }, __queryID: 'q1' },
        ],
      },
      request,
    );

    expect(result).toEqual({
      facets: { brand: { Nike: 3 } },
      facets_stats: {},
      hits: [{ objectID: '1' }],
      hitsPerPage: 10,
      index: 'products',
      nbHits: 25,
      nbPages: 3,
      page: 0,
      query: 'shirt',
      queryID: 'q1',
      renderingContent: { facetOrdering: { facets: { order: ['brand'] } } },
    });
  });

  it('returns an empty result when the index is missing', () => {
    const result = transform(undefined, request);

    expect(result).toMatchObject({ hits: [], nbHits: 0, index: 'products', queryID: 'products' });
  });
});
