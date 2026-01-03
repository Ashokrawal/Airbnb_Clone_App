import React, { useState, type ChangeEvent } from "react";
import "../styles/RegisterPage.css";

interface formProps {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<formProps>({
    name: "",
    email: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all details");
    }

    console.log("Submitting data:", formData);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Welcome to Airbnb</h1>

        <form className="register-form" onSubmit={handleFormSubmit}>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleFormData}
          />
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
          />
          <button className="btn-primary">Register</button>
        </form>

        <div className="divider">
          <div className="line"></div>
          <span>or</span>
          <div className="line"></div>
        </div>

        {/* <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={() => {}}
            onError={() => {}}
            text="continue_with"
          />
        </div> */}
        {/* 
        <div className="login-link">
          Already a member? <Link to={"/login"}>Login</Link>
        </div> */}
      </div>
    </div>
  );
};

export default RegisterPage;
