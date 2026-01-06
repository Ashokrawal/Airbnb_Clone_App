import { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { UserContext } from "@/providers/UserProvider";
import { PlaceContext } from "@/providers/PlaceProvider";
import {
  getItemFromLocalStorage,
  setItemsInLocalStorage,
  removeItemFromLocalStorage,
} from "@/utils";
import axiosInstance from "@/utils/axios";

// --- 1. Define Shared Interfaces ---
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Place {
  id: string;
  _id?: string; // Supporting both id formats if necessary
  title: string;
  address: string;
  photos: string[];
  description: string;
  price: number;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

interface GoogleJwtPayload {
  given_name: string;
  family_name: string;
  email: string;
}

// --- 2. USER AUTH HOOKS ---

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};

export const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = getItemFromLocalStorage("user");
    if (storedUser) {
      try {
        setUser(
          typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser
        );
      } catch (error) {
        console.error("Failed to parse user", error);
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    setItemsInLocalStorage("user", userData);
    setItemsInLocalStorage("token", token);
  };

  const register = async (formData: any): Promise<AuthResponse> => {
    try {
      const { data } = await axiosInstance.post("user/register", formData);
      if (data.user && data.token) handleAuthSuccess(data.user, data.token);
      return { success: true, message: "Registration successful" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error",
      };
    }
  };

  const login = async (formData: any): Promise<AuthResponse> => {
    try {
      const { data } = await axiosInstance.post("user/login", formData);
      if (data.user && data.token) handleAuthSuccess(data.user, data.token);
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error",
      };
    }
  };

  const googleLogin = async (credential: string): Promise<AuthResponse> => {
    const decoded = jwt_decode<GoogleJwtPayload>(credential);
    try {
      const { data } = await axiosInstance.post("user/google/login", {
        name: `${decoded.given_name} ${decoded.family_name}`,
        email: decoded.email,
      });
      if (data.user && data.token) handleAuthSuccess(data.user, data.token);
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      const { data } = await axiosInstance.get("/user/logout");
      if (data.success) {
        setUser(null);
        removeItemFromLocalStorage("user");
        removeItemFromLocalStorage("token");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const uploadPicture = async (picture: File): Promise<string> => {
    const formData = new FormData();
    formData.append("picture", picture);
    const { data } = await axiosInstance.post(
      "/user/upload-picture",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  };

  const updateUser = async (userDetails: any) => {
    try {
      const { data } = await axiosInstance.put("/user/update-user", {
        ...userDetails,
        email: user?.email,
      });
      if (data.user) {
        setUser(data.user);
        setItemsInLocalStorage("user", data.user);
      }
      return data;
    } catch (error) {
      console.error("Update error", error);
    }
  };

  return {
    user,
    setUser,
    register,
    login,
    googleLogin,
    logout,
    loading,
    uploadPicture,
    updateUser,
  };
};

// --- 3. PLACES HOOKS ---

export const usePlaces = () => {
  const context = useContext(PlaceContext);
  if (context === undefined) {
    throw new Error("usePlaces must be used within a PlaceProvider");
  }
  return context;
};

export const useProvidePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getPlaces = async () => {
    try {
      const { data } = await axiosInstance.get("/places");
      // Adjust this line if your API returns { places: [...] } or just [...]
      setPlaces(data.places || data);
    } catch (error) {
      console.error("Error fetching places", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  return { places, setPlaces, loading, setLoading };
};

// --- 4. SEARCH / FILTER HOOKS ---

export interface SearchData {
  place: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
}

export const useProvideSearch = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    place: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 0, children: 0, infants: 0, pets: 0 },
  });

  // set PLACES
  const setPlace = (location: string) => {
    setSearchData((prev) => ({
      ...prev,
      place: location,
    }));
  };

  // Helper to update specific date fields
  const setDates = (type: "checkIn" | "checkOut", value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const updateGuests = (
    type: keyof SearchData["guests"],
    operation: "inc" | "dec"
  ) => {
    setSearchData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]:
          operation === "inc"
            ? prev.guests[type] + 1
            : Math.max(0, prev.guests[type] - 1),
      },
    }));
  };

  return {
    searchData,
    setSearchData,
    updateGuests,
    setDates,
    setPlace,
  };
};
