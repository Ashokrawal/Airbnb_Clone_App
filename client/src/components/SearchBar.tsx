import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearch } from "@/providers/SearchProvider";
import "../styles/SearchBar.css";

const SearchBar = () => {
  const [selected, setSelected] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Consume global search context
  const { searchData, setPlace, setDates, updateGuests } = useSearch();

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const dateDisplayRange = useMemo(() => {
    if (!searchData.checkIn) return "Add dates";
    const start = formatDateDisplay(searchData.checkIn);
    const end = searchData.checkOut
      ? ` - ${formatDateDisplay(searchData.checkOut)}`
      : "";
    return `${start}${end}`;
  }, [searchData.checkIn, searchData.checkOut]);

  const handleSearch = () => {
    console.log("Searching for:", searchData);
    setSelected("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSelected("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      {/* Forced to pill-big regardless of props */}
      <div className="search-pill pill-big">
        <div className="pill-content-large">
          {/* WHERE SECTION */}

          <div
            className={`search-section-item first ${selected === "where" ? "is-selected" : ""}`}
            onClick={() => setSelected("where")}
          >
            <label>Where</label>
            <input
              type="text"
              className="searchInput"
              placeholder="Search destinations"
              value={searchData.place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>

          <div className="v-divider"></div>

          {/* DATES SECTION */}
          <div
            className={`search-section-item ${selected === "check-in" ? "is-selected" : ""}`}
            onClick={() => setSelected("check-in")}
          >
            <label>Dates</label>
            <div className="placeholder">{dateDisplayRange}</div>
          </div>

          <div className="v-divider"></div>

          {/* GUESTS SECTION */}
          <div
            className={`search-section-item last ${selected === "who" ? "is-selected" : ""}`}
            onClick={() => setSelected("who")}
          >
            <div className="item-text">
              <label>Who</label>
              <div className="placeholder">
                {searchData.guests.adults + searchData.guests.children > 0
                  ? `${searchData.guests.adults + searchData.guests.children} guests`
                  : "Add guests"}
              </div>
            </div>
            <button
              className="search-btn-large"
              onClick={(e) => {
                e.stopPropagation();
                handleSearch();
              }}
            >
              <svg
                viewBox="0 0 32 32"
                className="s-icon"
                stroke="white"
                strokeWidth="4"
                fill="none"
              >
                <path d="m13 24c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11zm8-3 9 9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWNS */}
      {selected && (
        <div className={`dropdown-container ${selected}`}>
          <div className="dropdown-content-inner">
            {selected === "where" && (
              <div className="dest-menu">
                <h4>Suggested destinations</h4>
                <ul>
                  {["Europe", "United Kingdom", "Southeast Asia", "Japan"].map(
                    (loc) => (
                      <li
                        key={loc}
                        onClick={() => {
                          setPlace(loc);
                          setSelected("check-in");
                        }}
                      >
                        {loc}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {selected === "check-in" && (
              <div className="calendar-menu">
                <h4>Select dates</h4>
                <div className="date-inputs-wrapper">
                  <div className="date-field">
                    <label>Arrival</label>
                    <input
                      type="date"
                      className="custom-date-input"
                      value={searchData.checkIn}
                      onChange={(e) => setDates("checkIn", e.target.value)}
                    />
                  </div>
                  <div className="date-separator"></div>
                  <div className="date-field">
                    <label>Departure</label>
                    <input
                      type="date"
                      className="custom-date-input"
                      value={searchData.checkOut}
                      onChange={(e) => setDates("checkOut", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {selected === "who" && (
              <div className="guests-menu">
                {[
                  { id: "adults", label: "Adults", sub: "Ages 13+" },
                  { id: "children", label: "Children", sub: "Ages 2–12" },
                  { id: "infants", label: "Infants", sub: "Under 2" },
                  { id: "pets", label: "Pets", sub: "Service animal?" },
                ].map((item) => (
                  <div className="guest-row" key={item.id}>
                    <div className="guest-info">
                      <span>{item.label}</span>
                      <small>{item.sub}</small>
                    </div>
                    <div className="counter">
                      <button
                        className="btn-counter"
                        onClick={() => updateGuests(item.id as any, "dec")}
                      >
                        -
                      </button>
                      <span className="count">
                        {
                          searchData.guests[
                            item.id as keyof typeof searchData.guests
                          ]
                        }
                      </span>
                      <button
                        className="btn-counter"
                        onClick={() => updateGuests(item.id as any, "inc")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
