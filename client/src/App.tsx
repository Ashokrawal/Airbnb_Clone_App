import { useEffect, useState } from "react";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PlacesFormPage from "./pages/PlaceFormPage";
import PlacesPage from "./pages/PlacesPage";
import BookingsPage from "./pages/BookingsPage";
import SingleBookedPlace from "./pages/SingleBookedPlace";
import NotFoundPage from "./pages/PageNotFound";

import { Slide, ToastContainer } from "react-toastify";
import { getItemFromLocalStorage } from "./utils";
import axiosInstance from "./utils/axios";
import SearchPage from "./pages/SearchPage";

function App() {
  useEffect(() => {
    // set the token on refreshing the website
    axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${getItemFromLocalStorage("token")}`;
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesFormPage />} />
            <Route path="/place/:id" element={<PlacesPage />} />
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route path="/searchPage" element={<SearchPage />} />
            <Route
              path="/account/bookings/:id"
              element={<SingleBookedPlace />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <ToastContainer autoClose={2000} transition={Slide} />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
