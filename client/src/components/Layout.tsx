import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Add useLocation
import { Header } from "./Header";
import "../styles/Layout.css";
import Footer from "./Footer";
import "../styles/Footer.css";

const Layout = () => {
  const location = useLocation();

  // Check if we are on the booking success page
  const isBookingSuccess = location.pathname === "/bookingSuccess";

  return (
    <div className="app-layout">
      {/* Conditionally add 'no-padding' class */}
      <div className={`main-layout ${isBookingSuccess ? "no-padding" : ""}`}>
        <Header />
      </div>

      <main className="layout">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
