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
import PlacesPage from "./pages/BookingWidget";
import BookingsPage from "./pages/BookingsPage";
import SingleBookedPlace from "./pages/SingleBookedPlace";
import NotFoundPage from "./pages/PageNotFound";
import { Slide, ToastContainer } from "react-toastify";
import { getItemFromLocalStorage } from "./utils";
import axiosInstance from "./utils/axios";
import SearchPage from "./pages/SearchPage";
import PlacePage from "./pages/PlacePage";
import { WishlistsPage } from "./pages/WishlistsPage";
import { MessagesPage } from "./pages/MessagesPage";
import BecomeAHost from "./pages/BecomeAHost";
import TripsPage from "./pages/TripsPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    // set the token on refreshing the website
    axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${getItemFromLocalStorage("token")}`;
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Use a dynamic parameter :subpage? (the ? makes it optional) */}
            <Route path="/account/:subpage?" element={<ProfilePage />} />

            {/* Specific routes for forms and single items */}
            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesFormPage />} />
            <Route
              path="/account/bookings/:id"
              element={<SingleBookedPlace />}
            />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/wishlists" element={<WishlistsPage />} />
            <Route path="/messages" element={<MessagesPage />} />

            <Route path="/profile/:subpage?" element={<ProfilePage />} />

            {/* Add this so the 'Places' tab in the profile works */}
            <Route path="/account/places" element={<PlacePage />} />

            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesFormPage />} />

            <Route path="/place" element={<PlacePage />} />
            <Route path="/searchPage" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/becomeAHost" element={<BecomeAHost />} />
          </Route>
        </Routes>
        <ToastContainer autoClose={2000} transition={Slide} />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
