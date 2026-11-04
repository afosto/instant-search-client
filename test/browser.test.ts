import { afterEach, describe, expect, it } from 'vitest';

describe('browser entry', () => {
  afterEach(() => {
    delete (globalThis as { afostoInstantSearch?: unknown }).afostoInstantSearch;
  });

  it('sets the client on the global object', async () => {
    await import('../src/browser');

    expect(typeof (globalThis as { afostoInstantSearch?: unknown }).afostoInstantSearch).toBe('function');
  });
});
