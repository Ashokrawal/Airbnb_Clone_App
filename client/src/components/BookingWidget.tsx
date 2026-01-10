import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks";
import "../styles/BookingWidget.css";

interface Place {
  _id: string;
  price: number;
  maxGuests: number;
  title: string;
}

interface BookingState {
  date: {
    checkIn: string;
    checkOut: string;
  };
  guestDetails: {
    count: number;
    name: string;
    phone: string;
  };
}

const BookingWidget: React.FC<{ place: Place }> = ({ place }) => {
  const { user } = useAuth();
  const [redirectData, setRedirectData] = useState<any>(null);

  const [bookingData, setBookingData] = useState<BookingState>({
    date: { checkIn: "", checkOut: "" },
    guestDetails: { count: 1, name: "", phone: "" },
  });

  // Sync user info
  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        guestDetails: { ...prev.guestDetails, name: user.name || "" },
      }));
    }
  }, [user]);

  // Logic to calculate nights
  const numberOfNights = useMemo(() => {
    const { checkIn, checkOut } = bookingData.date;
    if (!checkIn || !checkOut) return 0;
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    return nights > 0 ? nights : 0;
  }, [bookingData.date]);

  // Handle Date Inputs
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      date: { ...prev.date, [name]: value },
    }));
  };

  // Fixed Guest Bug: Prevents NaN and out-of-bounds numbers
  const handleGuestChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "count") {
      let val = parseInt(value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > place.maxGuests) val = place.maxGuests;

      setBookingData((prev) => ({
        ...prev,
        guestDetails: { ...prev.guestDetails, count: val },
      }));
    } else {
      setBookingData((prev) => ({
        ...prev,
        guestDetails: { ...prev.guestDetails, [name]: value },
      }));
    }
  };

  const handleReserve = () => {
    const { checkIn, checkOut } = bookingData.date;
    const { count, name, phone } = bookingData.guestDetails;

    // Validations
    if (!user) return setRedirectData({ path: "/login" });
    if (!checkIn || !checkOut || numberOfNights <= 0) {
      return toast.error("Please select valid check-in and check-out dates");
    }
    if (!name || !phone)
      return toast.error("Please fill in your contact details");

    const totalPrice = numberOfNights * place.price;

    // Directly navigate to success page with state (No Axios)
    setRedirectData({
      path: "/booking-success",
      state: {
        bookingId: `BK-${Math.floor(Math.random() * 100000)}`, // Dummy ID for UI
        place: place,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: count,
        totalPrice: totalPrice,
      },
    });
  };

  if (redirectData) {
    return (
      <Navigate to={redirectData.path} state={redirectData.state} replace />
    );
  }

  return (
    <div className="booking-widget-card">
      <div className="price-header">
        <span className="price-amount">₹{place.price.toLocaleString()}</span>
        <span className="per-night"> night</span>
      </div>

      <div className="airbnb-input-group">
        <div className="date-input-row">
          <div className="input-cell half border-right">
            <label>CHECK-IN</label>
            <input
              type="date"
              name="checkIn"
              value={bookingData.date.checkIn}
              onChange={handleDateChange}
            />
          </div>
          <div className="input-cell half">
            <label>CHECKOUT</label>
            <input
              type="date"
              name="checkOut"
              value={bookingData.date.checkOut}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="input-cell border-top">
          <label>GUESTS</label>
          <input
            type="number"
            name="count"
            min={1}
            max={place.maxGuests}
            value={bookingData.guestDetails.count}
            onChange={handleGuestChange}
          />
        </div>

        <div className="input-cell border-top">
          <label>FULL NAME</label>
          <input
            type="text"
            name="name"
            placeholder="Name on ID"
            value={bookingData.guestDetails.name}
            onChange={handleGuestChange}
          />
        </div>
        <div className="input-cell border-top">
          <label>PHONE NUMBER</label>
          <input
            type="tel"
            name="phone"
            placeholder="Contact number"
            value={bookingData.guestDetails.phone}
            onChange={handleGuestChange}
          />
        </div>
      </div>

      <button onClick={handleReserve} className="book-btn">
        {numberOfNights > 0 ? "Reserve" : "Check availability"}
      </button>

      {numberOfNights > 0 && (
        <div className="price-breakdown">
          <p className="notice">You won't be charged yet</p>
          <div className="row">
            <span className="underline">
              ₹{place.price.toLocaleString()} × {numberOfNights} nights
            </span>
            <span>₹{(numberOfNights * place.price).toLocaleString()}</span>
          </div>
          <div className="divider"></div>
          <div className="row total">
            <span>Total before taxes</span>
            <span>₹{(numberOfNights * place.price).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
