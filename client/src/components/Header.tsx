import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/index";
import SearchBar from "./SearchBar";
import "../styles/Header.css";
import LoginDropBoxBtn from "./LoginDropBoxBtn";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export const Header: React.FC = () => {
  const { user } = useAuth() as { user: User | null; logout: () => void };
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Shrunk state triggers after 50px scroll
      setIsExpanded(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking outside the menuRef container, close the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      <header className={`main-header ${isExpanded ? "expanded" : "shrunk"}`}>
        <div className="header-container">
          {/* LEFT: Logo - Disappears on scroll via nav-hidden class */}
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

          {/* CENTER: Navigation Links */}
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
              <div className="shrunk-search-trigger">
                {/* Placeholder content for when search bar is pulled up */}
              </div>
            )}
          </div>

          {/* RIGHT: User Pill */}
          <div
            className={`header-right hide-on-mobile ${!isExpanded ? "nav-hidden" : ""}`}
            ref={menuRef}
            style={{ position: "relative" }} // This ensures the menu stays attached to the pill
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
                {user?.picture ? (
                  <img src={user.picture} className="user-img" alt="user" />
                ) : (
                  <div className="placeholder-user" />
                )}
              </div>
            </div>

            {/* --- ADD THIS BLOCK BELOW --- */}
            {isMenuOpen && (
              <div className="desktop-dropdown">
                {!user ? (
                  <>
                    <div className="dropdown-section">
                      <Link
                        to="/signup"
                        className="bold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Log in
                      </Link>
                    </div>
                    <hr />
                    <div className="dropdown-section">
                      <Link to="/host" onClick={() => setIsOpen(false)}>
                        Become a host
                      </Link>
                      <Link to="/help" onClick={() => setIsOpen(false)}>
                        Help Center
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="dropdown-section">
                    <Link to="/profile" className="bold">
                      Profile
                    </Link>
                    <Link to="/trips">Trips</Link>
                    <hr />
                    <button onClick={() => logout()} className="logout-btn">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE SEARCH - Always simplified on small screens */}
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

        {/* Search Bar - Position is adjusted via CSS when header is shrunk */}
        <div className="search-bar-wrapper hide-on-mobile">
          <SearchBar />
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav show-on-mobile">
        <Link to="/" className="nav-item active">
          <svg viewBox="0 0 32 32">
            <path d="M16 2.5L2 14v15.5h9V19h10v10.5h9V14L16 2.5z" />
          </svg>
          <span>Explore</span>
        </Link>
        <Link to="/wishlists" className="nav-item">
          <svg viewBox="0 0 32 32">
            <path d="M16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
          </svg>
          <span>Wishlists</span>
        </Link>

        <button className="nav-item">
          <svg viewBox="0 0 32 32">
            <path d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm0 28a13 13 0 1 1 13-13 13 13 0 0 1-13 13zM16 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z" />
          </svg>

          <span>Log in</span>
        </button>
      </nav>
    </>
  );
};
