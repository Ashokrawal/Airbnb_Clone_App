import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import "@/styles/TripsPage.css";

const TripsPage = () => {
  // Mock data - in your real app, this comes from useAuth or a useBookings hook
  const bookings = [
    {
      id: "1",
      title: "Luxury Villa in Bali",
      location: "Ubud, Indonesia",
      date: "Oct 12 – 17, 2026",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=500",
      status: "upcoming",
    },
  ];

  return (
    <div className="trips-container">
      <header className="trips-header">
        <h1>Trips</h1>
      </header>

      {bookings.length === 0 ? (
        <div className="trips-empty">
          <div className="empty-text">
            <h2>No trips booked... yet!</h2>
            <p>
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link to="/" className="search-btn">
              Start searching
            </Link>
          </div>
          <div className="empty-img-box">
            <img
              src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=500"
              alt="Travel"
            />
          </div>
        </div>
      ) : (
        <div className="trips-list">
          <section className="trips-section">
            <h2 className="section-subtitle">Upcoming reservations</h2>
            <div className="trips-grid">
              {bookings.map((trip) => (
                <Link
                  to={`/account/bookings/${trip.id}`}
                  key={trip.id}
                  className="trip-card"
                >
                  <div className="trip-card-img">
                    <img src={trip.img} alt={trip.title} />
                  </div>
                  <div className="trip-card-content">
                    <div className="trip-info">
                      <h3>{trip.location}</h3>
                      <p className="trip-host">Hosted by Sarah</p>
                      <p className="trip-dates">{trip.date}</p>
                    </div>
                    <ChevronRight className="trip-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TripsPage;
