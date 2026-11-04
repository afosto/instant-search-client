import { afterEach, describe, expect, it, vi } from 'vitest';
import { afostoInstantSearch } from '../src';

const mockFetch = (body: unknown) => {
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({ json: async () => body }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('afostoInstantSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requires a search engine key', () => {
    expect(() => afostoInstantSearch('')).toThrow('A search engine key is required');
  });

  it('answers with { results } for every request', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const { data } = JSON.parse(String(init?.body));
      return {
        json: async () =>
          data.map((context: { __queryID: string; indices: string[] }) => ({
            __queryID: context.__queryID,
            results: [{ id: context.indices[0], count: 1, hits: [{ objectID: '1' }] }],
          })),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = afostoInstantSearch('key');
    const { results } = await client.search([
      { indexName: 'products', params: { query: 'shirt', page: 0, hitsPerPage: 10 } },
      { indexName: 'pages', params: { query: 'shirt', page: 0, hitsPerPage: 10 } },
    ]);

    expect(fetchMock).toHaveBeenCalledWith('https://afosto.app/api/instant/search/key', expect.any(Object));
    expect(results.map(result => [result.index, result.nbHits])).toEqual([
      ['products', 1],
      ['pages', 1],
    ]);
  });

  it('skips the request for an empty query when allowEmptyQuery is false', async () => {
    const fetchMock = mockFetch({});
    const client = afostoInstantSearch('key', { allowEmptyQuery: false });
    const { results } = await client.search([{ indexName: 'products', params: { query: '' } }]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(results).toHaveLength(1);
  });

  it('merges custom headers into the search request', async () => {
    const fetchMock = mockFetch([]);
    const client = afostoInstantSearch('key', { requestOptions: { headers: { 'X-Custom': 'yes' } } });
    await client.search([{ indexName: 'products', params: { query: 'a' } }]);

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual({
      Accept: 'application/vnd.instantsearch+json',
      'X-Custom': 'yes',
    });
  });

  it('returns the settings data, or an empty object on failure', async () => {
    mockFetch({ data: { indexes: [{ alias: 'products' }] } });
    expect(await afostoInstantSearch('key').getSettings()).toEqual({ indexes: [{ alias: 'products' }] });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await afostoInstantSearch('key').getSettings()).toEqual({});
  });

  it('answers searchForFacetValues with no facet hits', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(afostoInstantSearch('key').searchForFacetValues()).resolves.toEqual({
      facetHits: [],
      exhaustiveFacetsCount: true,
    });
    expect(warn).toHaveBeenCalledOnce();

    warn.mockRestore();
  });
});
