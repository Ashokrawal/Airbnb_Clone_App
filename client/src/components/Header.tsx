import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/index";
import SearchBar from "./SearchBar";
import "../styles/Header.css";
import AuthModal from "./AuthModal";
import { UserAvatar } from "./UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export const Header: React.FC = () => {
  const { user, logout } = useAuth() as {
    user: User | null;
    logout: () => void;
  };
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`main-header ${isExpanded ? "expanded" : "shrunk"}`}>
        <div className="header-container">
          <div
            className={`header-left hide-on-mobile ${!isExpanded ? "nav-hidden" : ""}`}
          >
            <Link to="/">
              <img
                src="/Airbnb-Logo.wine.svg"
                alt="Airbnb"
                className="airbnb-logo"
              />
            </Link>
          </div>

          <div className="header-center hide-on-mobile">
            {isExpanded ? (
              <div className="center-links">
                <Link to="/" className="active links">
                  Homes
                </Link>
                <Link to="/experiences" className="links">
                  Experiences
                </Link>
                <Link to="/Services" className="links">
                  Services
                </Link>
              </div>
            ) : (
              <div className="shrunk-search-trigger"></div>
            )}
          </div>

          <div
            className={`header-right hide-on-mobile ${!isExpanded ? "nav-hidden" : ""}`}
            ref={menuRef}
            style={{ position: "relative" }}
          >
            <div
              className="user-pill"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                viewBox="0 0 32 32"
                className="hamburger-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="m2 16h28M2 24h28M2 8h28" />
              </svg>
              <div className="avatar-box">
                {/* We wrap the Radix components inside your existing 'avatar-box' */}
                <Avatar className="user-img border-none">
                  <AvatarImage
                    src={user?.picture}
                    alt={user?.name}
                    referrerPolicy="no-referrer"
                    className="object-cover h-full w-full"
                  />

                  {/* This fallback only renders if src is null OR the image fails to load */}
                  <AvatarFallback className="bg-zinc-800 text-white flex items-center justify-center font-medium">
                    {user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      /* The default Airbnb silhouette if no name exists */
                      <svg
                        viewBox="0 0 32 32"
                        fill="currentColor"
                        className="w-1/2 h-1/2"
                      >
                        <path d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0 -5-5zm0 2a3 3 0 1 1 -3 3 3 3 0 0 1 3-3zm0 18c7 0 14 0 14-2a14 14 0 0 0 -28 0c0 2 7 2 14 2z" />
                      </svg>
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {isMenuOpen && (
              <div className="desktop-dropdown">
                {!user ? (
                  <>
                    <div className="dropdown-section">
                      <div
                        className="dropdown-link bold"
                        onClick={handleAuthClick}
                      >
                        Sign up
                      </div>
                      <div className="dropdown-link" onClick={handleAuthClick}>
                        Log in
                      </div>
                    </div>
                    <hr />
                    <div className="dropdown-section">
                      <Link to="/host">Become a host</Link>
                      <Link to="/help">Help Center</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-section greeting">
                      <span className="bold">
                        Hi, {user.name.split(" ")[0]}!
                      </span>
                    </div>
                    <hr />
                    <div className="dropdown-section">
                      <Link to="/profile" className="bold">
                        Profile
                      </Link>
                      <Link to="/trips">Trips</Link>
                      <Link to="/wishlists">Wishlists</Link>
                    </div>
                    <hr />
                    <div className="dropdown-section">
                      <Link to="/becomeAHost">Host your home</Link>
                      <Link to="/account">Account</Link>
                    </div>
                    <hr />
                    <div className="dropdown-section">
                      <button onClick={() => logout()} className="logout-btn">
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mobile-header-search show-on-mobile">
            <div className="mobile-search-pill">
              <svg
                viewBox="0 0 32 32"
                className="m-search-icon"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              >
                <path d="m13 24c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11zm8-3 9 9" />
              </svg>
              <div className="m-search-text">
                <span className="m-title">Anywhere</span>
                <span className="m-subtitle">Any week • Add guests</span>
              </div>
            </div>
          </div>
        </div>
        <div className="search-bar-wrapper hide-on-mobile">
          <SearchBar />
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav show-on-mobile">
        <Link to="/" className="nav-item">
          <svg viewBox="0 0 32 32" className="nav-svg">
            <path
              d="M16 1l14 11v17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V12L16 1z"
              stroke="currentColor"
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
          <span>Explore</span>
        </Link>

        <Link to="/wishlists" className="nav-item">
          <svg viewBox="0 0 32 32" className="nav-svg">
            <path
              d="M16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
          <span>Wishlists</span>
        </Link>

        <Link to="/trips" className="nav-item">
          <svg viewBox="0 0 32 32" className="nav-svg">
            <path
              d="M16 1L2 12v17a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V12L16 1z"
              stroke="currentColor"
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
          <span>Trips</span>
        </Link>

        <Link to="/messages" className="nav-item">
          <svg viewBox="0 0 32 32" className="nav-svg">
            <path
              d="M26 4H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4l6 6 6-6h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
              stroke="currentColor"
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
          <span>Inbox</span>
        </Link>

        {user ? (
          <Link to="/profile" className="nav-item">
            <div className="mobile-avatar-container">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.picture}
                  referrerPolicy="no-referrer"
                  className="object-cover rounded-full"
                />
                <AvatarFallback className="bg-zinc-800 text-white text-[10px] rounded-full flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span>Profile</span>
          </Link>
        ) : (
          <button className="nav-item" onClick={handleAuthClick}>
            <svg viewBox="0 0 32 32" className="nav-svg">
              <circle
                cx="16"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M27 28c0-5.523-4.477-10-10-10S7 22.477 7 28"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
            <span>Log in</span>
          </button>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
