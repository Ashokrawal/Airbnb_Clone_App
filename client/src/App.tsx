import { useState } from "react";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
