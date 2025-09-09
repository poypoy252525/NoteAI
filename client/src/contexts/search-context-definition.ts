import { createContext } from "react";
import { type SearchContextType } from "@/types/search-types";

export const SearchContext = createContext<SearchContextType | undefined>(undefined);
