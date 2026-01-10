import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, MapPin, Calendar, Smartphone } from "lucide-react";
import "@/styles/BecomeAHost.css";

const BecomeAHost: React.FC = () => {
  return (
    <div className="hosting-page">
      {/* HERO SECTION */}
      <section className="hosting-hero">
        <div className="hero-content">
          <h1 className="hero-title">Airbnb it.</h1>
          <p className="hero-subtitle">
            You could earn <span className="highlight-price">$2,450</span> a
            month by hosting in your area.
          </p>
          <Link to="/account/places/new" className="primary-cta">
            Setup your listing
          </Link>
        </div>
        <div className="hero-image-box">
          <img
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000"
            alt="Beautiful home"
          />
        </div>
      </section>

      {/* 3-STEP GUIDE */}
      <section className="step-guide">
        <h2 className="section-heading">It’s easy to get started</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-num">1</span>
            <h3>Tell us about your place</h3>
            <p>
              Share some basic info, like where it is and how many guests can
              stay.
            </p>
          </div>
          <div className="step-card">
            <span className="step-num">2</span>
            <h3>Make it stand out</h3>
            <p>
              Add 5 or more photos plus a title and description—we’ll help you
              out.
            </p>
          </div>
          <div className="step-card">
            <span className="step-num">3</span>
            <h3>Finish up and publish</h3>
            <p>
              Choose if you want to start with an experienced guest, then
              publish your listing.
            </p>
          </div>
        </div>
      </section>

      {/* AIRCOVER SECTION */}
      <section className="aircover-banner">
        <div className="aircover-header">
          <span className="aircover-logo">
            air<span className="red">cover</span>
          </span>
          <p>Top-to-bottom protection for every Host.</p>
        </div>
        <div className="aircover-grid">
          <div className="aircover-item">
            <h4>Guest identity verification</h4>
            <p>
              Our verification system checks details such as name, address, and
              more.
            </p>
          </div>
          <div className="aircover-item">
            <h4>Reservation screening</h4>
            <p>
              Our proprietary technology analyzes hundreds of factors to flag
              high-risk bookings.
            </p>
          </div>
          <div className="aircover-item">
            <h4>$3M damage protection</h4>
            <p>
              We reimburse you for damage caused by guests to your home and
              belongings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeAHost;
