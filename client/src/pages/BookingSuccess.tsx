import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/BookingSuccess.css";

interface Place {
  _id: string;
  price: number;
  maxGuests: number;
  title: string;
}

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as {
    bookingId: string;
    place: Place;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  };

  if (!state) return <p>No booking data found!</p>;

  const { bookingId, place, checkIn, checkOut, guests, totalPrice } = state;

  return (
    <div className="booking-success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg viewBox="0 0 32 32" fill="none" stroke="green" strokeWidth="3">
            <path
              d="M4 16l8 8 16-16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>Booking Successful!</h1>
        <p className="success-message">
          Your booking at <strong>{place.title}</strong> is confirmed.
        </p>

        <div className="booking-details">
          <p>
            <strong>Booking ID:</strong> {bookingId}
          </p>
          <p>
            <strong>Dates:</strong> {formatDateDisplay(checkIn)} -{" "}
            {formatDateDisplay(checkOut)}
          </p>
          <p>
            <strong>Guests:</strong> {guests}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹{totalPrice.toLocaleString()}
          </p>
        </div>

        <div className="cta-buttons">
          <Link to="/trips" className="btn-primary">
            View Trips
          </Link>
          <Link to="/" className="btn-secondary">
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
