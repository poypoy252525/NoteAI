import { type SemanticSearchResult } from "@/services/semantic-search.service";

export interface SearchState {
  query: string;
  results: SemanticSearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  filters: {
    category?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
    sortBy: 'relevance' | 'date' | 'title';
  };
}

export type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: SemanticSearchResult[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HAS_SEARCHED'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<SearchState['filters']> }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'RESET_STATE' };

export interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  actions: {
    setQuery: (query: string) => void;
    setLoading: (loading: boolean) => void;
    setResults: (results: SemanticSearchResult[]) => void;
    setError: (error: string | null) => void;
    setHasSearched: (hasSearched: boolean) => void;
    setFilters: (filters: Partial<SearchState['filters']>) => void;
    clearSearch: () => void;
    resetState: () => void;
  };
}

export const initialSearchState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  hasSearched: false,
  filters: {
    sortBy: 'relevance',
  },
};

export function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_HAS_SEARCHED':
      return { ...state, hasSearched: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_SEARCH':
      return { ...state, query: '', results: [], error: null, hasSearched: false };
    case 'RESET_STATE':
      return initialSearchState;
    default:
      return state;
  }
}
