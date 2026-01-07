import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const LoginDropBoxBtn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="login-dropdown-container" ref={dropdownRef}>
      {/* The Button */}
      <button
        className={`nav-item ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg viewBox="0 0 32 32">
          <path d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm0 28a13 13 0 1 1 13-13 13 13 0 0 1-13 13zM16 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z" />
        </svg>
        <span>Log in</span>
      </button>

      {/* The Menu */}
      {isOpen && (
        <div className="mobile-login-menu">
          <Link to="/become-a-host" onClick={() => setIsOpen(false)}>
            Become a host
          </Link>
          <div className="menu-divider" />
          <Link to="/signup" onClick={() => setIsOpen(false)}>
            Sign up
          </Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Log in
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginDropBoxBtn;
