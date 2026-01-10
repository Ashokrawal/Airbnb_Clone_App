import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AccountNavigation from "@/components/AccontNavigation";
import PlaceImg from "@/components/PlaceImage";
import BookingDates from "@/components/BookingDates";
import Spinner from "@/components/Spinner";
import axiosInstance from "@/utils/axios";
import "../styles/BookingsPage.css";

// Import the new CSS file

// --- Types ---
interface Place {
  _id: string;
  title: string;
  photos: string[];
}

interface Booking {
  _id: string;
  price: number;
  place: Place;
  checkIn: string;
  checkOut: string;
}

interface BookingsResponse {
  booking: Booking[];
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await axiosInstance.get<BookingsResponse>("/bookings");
        setBookings(data.booking);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="bookings-page-container">
      <AccountNavigation />
      <div className="bookings-list">
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              className="booking-card"
              key={booking._id}
            >
              <div className="booking-image-wrapper">
                {booking?.place?.photos?.[0] && (
                  <PlaceImg place={booking.place} className="booking-img" />
                )}
              </div>
              <div className="booking-details">
                <h2 className="booking-title">{booking?.place?.title}</h2>
                <div className="booking-info-wrapper">
                  <div className="booking-divider"></div>
                  <div className="booking-meta">
                    <BookingDates
                      booking={booking}
                      className="booking-dates-desktop"
                    />

                    <div className="price-tag">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="price-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>
                      <span className="price-amount">
                        Total price: ₹{booking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-bookings">
            <h1 className="trips-heading">Trips</h1>
            <hr className="divider" />
            <h3 className="no-trips-title">No trips booked... yet!</h3>
            <p className="no-trips-text">
              Time to dust off your bags and start planning your next adventure
            </p>
            <Link to="/" className="search-link">
              <div className="search-button">Start Searching</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
