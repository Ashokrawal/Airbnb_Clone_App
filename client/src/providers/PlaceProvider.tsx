import React, { createContext, ReactNode } from "react";
import { useProvidePlaces } from "@/hooks/index.js";

// 1. Define what a 'Place' looks like (Adjust based on your API)
interface Place {
  id: string;
  title: string;
  description: string;
  address: string;
  photos: string[];
  price: number;
  // add other fields as per your backend model
}

// 2. Define the shape of the Context data
interface PlaceContextType {
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// 3. Set the initial state with proper typing
const initialState: PlaceContextType = {
  places: [],
  setPlaces: () => {},
  loading: true,
  setLoading: () => {},
};

export const PlaceContext = createContext<PlaceContextType>(initialState);

// 4. Define Props for the Provider component
interface PlaceProviderProps {
  children: ReactNode;
}

export const PlaceProvider: React.FC<PlaceProviderProps> = ({ children }) => {
  const allPlaces = useProvidePlaces();

  return (
    <PlaceContext.Provider value={allPlaces}>{children}</PlaceContext.Provider>
  );
};
