import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/IndexPage.css";
import { useSearch } from "@/providers/SearchProvider";
import LazyRender from "@/components/LazyRender";

// This allows the app to use localhost during dev, but use your Vercel URL in production
const PLACES_API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1/places";

interface Place {
  _id: string;
  title: string;
  address: string;
  photos: string[];
  price: number;
  rating?: number;
  maxGuests: number;
}

interface SectionSliderProps {
  title: string;
  data: Place[];
  id: string;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  checkIn?: string;
  checkOut?: string;
  numberOfNights?: number;
}

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short", // "Jan"
    day: "numeric", // 7
  });
};

const SectionSlider = React.memo(
  ({
    title,
    data,
    id,
    wishlist,
    onToggleWishlist,
    checkIn,
    checkOut,
    numberOfNights,
  }: SectionSliderProps) => (
    <section className="slider-section" aria-labelledby={`title-${id}`}>
      <div className="section-header">
        <h2 id={`title-${id}`} className="section-title">
          {title}
        </h2>

        <div className="custom-nav-container hide-on-mobile">
          <button className={`nav-btn prev-${id}`} aria-label="Previous stays">
            <svg
              viewBox="0 0 32 32"
              className="nav-icon"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20 28L8 16L20 4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={`nav-btn next-${id}`} aria-label="Next stays">
            <svg
              viewBox="0 0 32 32"
              className="nav-icon"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 28L24 16L12 4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={2.2}
        navigation={{
          prevEl: `.prev-${id}`,
          nextEl: `.next-${id}`,
        }}
        breakpoints={{
          768: {
            slidesPerView: 3.2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 5.2,
            spaceBetween: 20,
          },
          1400: {
            slidesPerView: 7,
            spaceBetween: 12,
          },
        }}
        className="listing-swiper"
      >
        {data.map((place) => {
          const isFavorited = wishlist.includes(place._id);

          const firstPhoto = place.photos?.[0] || "";

          const imageUrl = firstPhoto
            ? `https://res.cloudinary.com/djcgonxur/image/upload/f_auto,q_auto,w_600,ar_1:1,c_fill/${firstPhoto}`
            : "https://via.placeholder.com/600";

          return (
            <SwiperSlide key={place._id}>
              <div className="listing-card">
                <Link to={`/place?id=${place._id}`} className="card-link">
                  <div className="image-container">
                    <img
                      loading="lazy"
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                      }}
                      src={imageUrl}
                      alt={place.title}
                    />
                    <button
                      className={`heart-button ${isFavorited ? "is-active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleWishlist(place._id);
                      }}
                      aria-label={
                        isFavorited ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                      </svg>
                    </button>
                  </div>
                  <div className="listing-info">
                    <div className="info-header">
                      <span className="location-title">
                        {place.title.substring(0, 30)}
                      </span>
                    </div>
                    {/* Dates & host info */}
                    <span className="subtitle2">
                      {checkIn && checkOut && (
                        <span>
                          {formatDateDisplay(checkIn)}
                          {checkOut ? ` - ${formatDateDisplay(checkOut)}` : ""}
                        </span>
                      )}{" "}
                      • Host
                    </span>

                    <p className="subtitle2">
                      <span className="rating-pill">
                        {numberOfNights && numberOfNights > 0
                          ? `₹${place.price * numberOfNights} for ${numberOfNights} nights`
                          : `₹${place.price} / night`}
                      </span>
                      <span className="rating-pill">
                        ★ {place.rating || "4.8"}
                      </span>
                    </p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  )
);

const IndexPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const { searchData } = useSearch();

  // Calculate number of nights whenever checkIn/checkOut changes
  const numberOfNights =
    searchData.checkIn && searchData.checkOut
      ? Math.ceil(
          (new Date(searchData.checkOut).getTime() -
            new Date(searchData.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get(PLACES_API);
        setPlaces(data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (loading) return <Spinner />;

  return (
    <main className="airbnb-page-wrapper">
      <div className="container">
        <LazyRender height={320}>
          <SectionSlider
            title="Popular homes in London"
            data={places.slice(7)}
            id="london"
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            numberOfNights={numberOfNights}
          />
        </LazyRender>
        <LazyRender height={320}>
          <SectionSlider
            title="Explore stays in New York"
            data={places.slice(13)}
            id="newyork"
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            numberOfNights={numberOfNights}
          />
        </LazyRender>

        <LazyRender height={320}>
          <SectionSlider
            title="Explore stays in Nepal"
            data={places.slice(20)}
            id="nepal"
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            numberOfNights={numberOfNights}
          />
        </LazyRender>

        <LazyRender height={320}>
          <SectionSlider
            title="Explore stays in India"
            data={places.slice(25)}
            id="india"
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            numberOfNights={numberOfNights}
          />
        </LazyRender>
      </div>
    </main>
  );
};

export default IndexPage;
