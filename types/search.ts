import { similaritySearch } from '@/lib/similarity-search';

export type SimilaritySearchResults = Awaited<
  ReturnType<typeof similaritySearch>
>;
