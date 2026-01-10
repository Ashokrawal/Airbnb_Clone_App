import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import ProfilePage from "./ProfilePage";
import { useAuth } from "@/hooks";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);

  // No more casting needed if useAuth in index.tsx is properly typed
  const auth = useAuth();

  // 1. Properly type the input change event
  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Properly type the form submission event
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await auth.login(formData);
      if (response.success) {
        toast.success(response.message);
        setRedirect(true);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("An error occurred during login");
    }
  };

  // 3. Type the Google Credential string

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await auth.googleLogin(credential);

      if (response.success) {
        toast.success(response.message);
        setRedirect(true);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  // auth.user is now typed as User | null
  if (auth.user) {
    return <ProfilePage />;
  }

  return (
    <div className="mt-4 login-page flex grow items-center  justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl">Login</h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            required
          />
          <button className="primary my-4" disabled={auth.loading}>
            {auth.loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

        <div className="flex h-[50px] justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse: CredentialResponse) => {
              // credentialResponse.credential is the raw JWT string from Google
              if (credentialResponse.credential) {
                handleGoogleLogin(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Google Login Failed");
            }}
            text="continue_with"
            width="350"
            theme="outline"
            shape="pill"
          />
        </div>

        <div className="py-2 text-center text-gray-500">
          Don't have an account yet?{" "}
          <Link className="text-black underline" to={"/register"}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
