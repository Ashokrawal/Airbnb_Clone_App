import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import Spinner from "@/components/Spinner";
import BookingWidget from "@/components/BookingWidget";
import ImageGallery from "@/components/ImageGallery";
import { Star, Share, Heart, ChevronLeft } from "lucide-react";
import "@/styles/PlacePage.css";
import MobileBookingBar from "@/components/MobileBookingBar";

const PlacePage: React.FC = () => {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  // 1. Hook to read ?id=... from the URL
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (showBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showBooking]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const getPlace = async () => {
      setLoading(true);
      try {
        // 1. Send the ID as a query parameter called 'id'
        // This matches your singlePlace controller: const { id } = req.query;
        const { data } = await axiosInstance.get(
          `/places/single?id=${encodeURIComponent(id)}`
        );
        setPlace(data.place);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getPlace();
  }, [id]);

  if (loading) return <Spinner />;

  if (!id || !place) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Listing Not Found</h2>
          <p>We couldn't locate the property you're looking for.</p>
          <button onClick={() => navigate("/")} className="back-btn">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="place-page-wrapper">
      <header className="place-header">
        <div className="header-top-nav">
          <button onClick={() => navigate(-1)} className="mobile-back-icon">
            <ChevronLeft size={24} />
          </button>
          <h1 className="place-title">{place.title}</h1>
        </div>

        <div className="place-meta-actions">
          <div className="meta-left">
            <span className="rating">
              <Star size={14} fill="currentColor" /> {place.rating || "4.9"}
            </span>
            <span className="dot">·</span>
            <span className="location-link">{place.address}</span>
          </div>
          <div className="meta-right hide-on-mobile">
            <button className="action-link">
              <Share size={16} /> Share
            </button>
            <button className="action-link">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>
      </header>

      <ImageGallery photos={place.photos} />

      <div className="place-layout-grid">
        <section className="place-details-column">
          <div className="host-profile">
            <h2>Hosted by {place.owner?.name || "Local Host"}</h2>
            <p>{place.maxGuests} guests · Studio · 1 bed · 1 bath</p>
          </div>

          <hr className="section-divider" />

          <div className="description-section">
            <h3 className="section-subtitle">About this space</h3>
            <p className="description-text">{place.description}</p>
          </div>

          <hr className="section-divider" />

          <div className="amenities-section">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              {place.perks?.map((perk: string) => (
                <div key={perk} className="amenity-item">
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="booking-sidebar hide-on-mobile">
          <div className="sticky-wrapper">
            <BookingWidget place={place} />
          </div>
        </aside>
      </div>
      <div className="place-layout-grid">
        <section className="place-details-column">{/* content */}</section>

        <aside className="booking-sidebar hide-in-desktop">
          <div className="sticky-wrapper">
            <BookingWidget place={place} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default PlacePage;
