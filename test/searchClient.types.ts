// Type test, checked by `pnpm typecheck`: the client must be assignable to InstantSearch's SearchClient.
import type { SearchClient } from 'instantsearch.js';
import { afostoInstantSearch } from '../src';

afostoInstantSearch('key') satisfies SearchClient;
