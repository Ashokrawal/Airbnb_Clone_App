import React, { createContext, useContext, type ReactNode } from "react";
import { useProvideSearch, type SearchData } from "@/hooks/index";

// Define the shape of the context
interface SearchContextType {
  searchData: SearchData;
  setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
  updateGuests: (
    type: keyof SearchData["guests"],
    operation: "inc" | "dec"
  ) => void;
  setDates: (type: "checkIn" | "checkOut", value: string) => void;
  setPlace: (location: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const search = useProvideSearch();

  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
};

// Custom hook to use the search context easily
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
