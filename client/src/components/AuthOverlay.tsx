// components/AuthOverlay.tsx
import React from "react";
import AuthModal from "./AuthModal";

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose }) => {
  // We can add logic here for Forgot Password, multi-step registration, etc.
  return <AuthModal isOpen={isOpen} onClose={onClose} />;
};

export default AuthOverlay;
