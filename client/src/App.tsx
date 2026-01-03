import { useState } from "react";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
