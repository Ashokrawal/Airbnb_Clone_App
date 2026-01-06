import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/RegisterPage.css";

// Use the alias we configured
import { useAuth } from "@/hooks/index";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);

  // auth will now be typed correctly thanks to our Provider casting
  const auth = useAuth();

  // Handle input changes with proper TS event typing
  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle standard registration
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await auth.register(formData);
      if (response.success) {
        toast.success(response.message || "Registration successful!");
        setRedirect(true);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      console.error("Registration error:", error);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await auth.googleLogin(credential);
      if (response.success) {
        toast.success(response.message || "Google Login successful!");
        setRedirect(true);
      } else {
        toast.error(response.message || "Google Login failed");
      }
    } catch (error: any) {
      toast.error("Google login failed");
    }
  };

  // Redirect after success
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="mb-4 text-center text-4xl font-semibold">Register</h1>

        <form className="mx-auto" onSubmit={handleFormSubmit}>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full border my-2 py-2 px-3 rounded-2xl"
            value={formData.name}
            onChange={handleFormData}
          />
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full border my-2 py-2 px-3 rounded-2xl"
            value={formData.email}
            onChange={handleFormData}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            required
            className="w-full border my-2 py-2 px-3 rounded-2xl"
            value={formData.password}
            onChange={handleFormData}
          />

          <button
            type="submit"
            disabled={auth.loading}
            className={`primary my-2 w-full p-2 rounded-2xl text-white ${auth.loading ? "bg-gray-400" : "bg-red-500"}`}
          >
            {auth.loading ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="my-4 flex w-full items-center gap-4">
          <div className="h-[1px] w-full bg-gray-300"></div>
          <p className="text-gray-500 text-sm">or</p>
          <div className="h-[1px] w-full bg-gray-300"></div>
        </div>

        {/* Google login button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleLogin(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Google Sign-In failed");
            }}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="py-2 text-center text-gray-500 mt-4">
          Already a member?{" "}
          <Link className="text-black underline font-bold" to={"/login"}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
