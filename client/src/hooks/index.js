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

// --- USER AUTH HOOK ---
export const useAuth = () => {
  return useContext(UserContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist user on refresh
  useEffect(() => {
    const storedUser = getItemFromLocalStorage("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from storage", error);
      }
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    const { name, email, password } = formData;
    try {
      const { data } = await axiosInstance.post("user/register", {
        name,
        email,
        password,
      });
      if (data.user && data.token) {
        handleAuthSuccess(data.user, data.token);
      }
      return { success: true, message: "Registration successful" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error",
      };
    }
  };

  const login = async (formData) => {
    const { email, password } = formData;
    try {
      const { data } = await axiosInstance.post("user/login", {
        email,
        password,
      });
      if (data.user && data.token) {
        handleAuthSuccess(data.user, data.token);
      }
      return { success: true, message: "Login successful" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error",
      };
    }
  };

  const googleLogin = async (credential) => {
    const decoded = jwt_decode(credential);
    try {
      const { data } = await axiosInstance.post("user/google/login", {
        name: `${decoded.given_name} ${decoded.family_name}`,
        email: decoded.email,
      });
      if (data.user && data.token) {
        handleAuthSuccess(data.user, data.token);
      }
      return { success: true, message: "Login successful" };
    } catch (error) {
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
      return { success: true, message: "Logout successful" };
    } catch (error) {
      return { success: false, message: "Something went wrong!" };
    }
  };

  const uploadPicture = async (picture) => {
    try {
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
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  const updateUser = async (userDetails) => {
    const { name, password, picture } = userDetails;
    // Accessing email from current state is safer than parsing LS again
    const email = user?.email;
    try {
      const { data } = await axiosInstance.put("/user/update-user", {
        name,
        password,
        email,
        picture,
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

  // Internal helper to keep things DRY
  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    setItemsInLocalStorage("user", userData);
    setItemsInLocalStorage("token", token);
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

// --- PLACES HOOK ---
export const usePlaces = () => {
  return useContext(PlaceContext);
};

export const useProvidePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaces = async () => {
    try {
      const { data } = await axiosInstance.get("/places");
      setPlaces(data.places);
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
