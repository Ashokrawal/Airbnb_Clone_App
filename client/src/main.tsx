import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";

// Use the aliases you configured!
// Also, ensure the file names match (UserProvider vs UserProviders)
import { UserProvider } from "@/providers/UserProvider";
import { PlaceProvider } from "@/providers/PlaceProvider";
import { SearchProvider } from "./providers/SearchProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <PlaceProvider>
        <SearchProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchProvider>
      </PlaceProvider>
    </UserProvider>
  </React.StrictMode>
);
