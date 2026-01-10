import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks";
import { AlertCircle } from "lucide-react"; // Optional: for error icon
import "../styles/AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setMode("login");
      setError(null);
      onClose();
    }, 400);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setFormData({ name: "", email: "", password: "" });
  };

  if (!isOpen && !isClosing) return null;

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear error when user types
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response =
        mode === "login"
          ? await auth.login({
              email: formData.email,
              password: formData.password,
            })
          : await auth.register(formData);

      if (response.success) {
        toast.success(response.message);
        handleClose(); // Automatically closes on success
      } else {
        // Handle specific "Invalid password" or "User not found" messages
        setError(response.message);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
    }
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? "exit" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${isClosing ? "exit" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-modal-header">
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
          <div className="header-title">
            {mode === "login" ? "Log in" : "Sign up"}
          </div>
        </div>

        <div className="auth-modal-body">
          <h2>Welcome to Airbnb</h2>

          <form onSubmit={handleFormSubmit} className="auth-form">
            <div className="input-container">
              {mode === "register" && (
                <input
                  name="name"
                  type="text"
                  className="auth-input-field"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleFormData}
                  required
                />
              )}
              <input
                name="email"
                type="email"
                className="auth-input-field"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormData}
                required
              />
              <input
                name="password"
                type="password"
                className="auth-input-field"
                placeholder="Password"
                value={formData.password}
                onChange={handleFormData}
                required
              />
            </div>

            {/* Professional Inline Error Message */}
            {error && (
              <div className="error-text">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <p className="auth-helper-text">
              We’ll call or text you to confirm your number. Standard rates
              apply.
            </p>

            <button className="auth-btn btn-email" disabled={auth.loading}>
              {auth.loading ? "Processing..." : "Continue"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login-container">
            <GoogleLogin
              onSuccess={(res) =>
                res.credential &&
                auth.googleLogin(res.credential).then(() => handleClose())
              }
              text={mode === "login" ? "signin_with" : "signup_with"}
              width="100%"
            />
          </div>

          <div className="auth-helper-text2">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              className="policy"
              onClick={toggleMode}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            >
              {mode === "login" ? "Register now" : "Log in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
