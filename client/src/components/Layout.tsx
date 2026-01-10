import React from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import "../styles/Layout.css";
import Footer from "./Footer";
import "../styles/Footer.css";

const Layout = () => {
  return (
    <>
      <div className="main-layout">
        <Header />
      </div>

      <div className="layout">
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
