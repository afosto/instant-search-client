// Type test against the emitted declarations (dist/index.d.ts), checked by `pnpm build`.
import type { SearchClient } from 'instantsearch.js';
import { afostoInstantSearch } from '@afosto/instant-search-client';

afostoInstantSearch('key') satisfies SearchClient;
