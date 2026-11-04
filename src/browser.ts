import { afostoInstantSearch } from './afostoInstantSearch';

// Assign the global explicitly instead of through a top-level `var`, so it is also set when the bundle
// is loaded with `<script type="module">` or wrapped in a function.
(globalThis as typeof globalThis & { afostoInstantSearch: typeof afostoInstantSearch }).afostoInstantSearch =
  afostoInstantSearch;
