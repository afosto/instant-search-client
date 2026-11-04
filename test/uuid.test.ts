import { afterEach, describe, expect, it, vi } from 'vitest';
import { uuid } from '../src/utils/uuid';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('generates a v4 uuid', () => {
    expect(uuid()).toMatch(UUID_V4);
  });

  it('generates a v4 uuid without crypto.randomUUID (insecure context)', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });

    expect(uuid()).toMatch(UUID_V4);
  });
});
