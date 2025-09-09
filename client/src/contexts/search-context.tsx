import { useReducer, type ReactNode } from "react";
import { SearchContext } from "@/contexts/search-context-definition";
import {
  initialSearchState,
  searchReducer,
  type SearchState,
} from "@/types/search-types";
import { type SemanticSearchResult } from "@/services/semantic-search.service";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const actions = {
    setQuery: (query: string) =>
      dispatch({ type: "SET_QUERY", payload: query }),
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setResults: (results: SemanticSearchResult[]) =>
      dispatch({ type: "SET_RESULTS", payload: results }),
    setError: (error: string | null) =>
      dispatch({ type: "SET_ERROR", payload: error }),
    setHasSearched: (hasSearched: boolean) =>
      dispatch({ type: "SET_HAS_SEARCHED", payload: hasSearched }),
    setFilters: (filters: Partial<SearchState["filters"]>) =>
      dispatch({ type: "SET_FILTERS", payload: filters }),
    clearSearch: () => dispatch({ type: "CLEAR_SEARCH" }),
    resetState: () => dispatch({ type: "RESET_STATE" }),
  };

  return (
    <SearchContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SearchContext.Provider>
  );
}
