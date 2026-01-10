import React, { useEffect, useState, type ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks";
import axiosInstance from "@/utils/axios";
import DatePickerWithRange from "./DatePickerWithRange";

interface Place {
  _id: string;
  price: number;
  maxGuests: number;
}

interface BookingData {
  noOfGuests: number;
  name: string;
  phone: string;
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface BookingWidgetProps {
  place: Place;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ place }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [bookingData, setBookingData] = useState<BookingData>({
    noOfGuests: 1,
    name: "",
    phone: "",
  });
  const [redirect, setRedirect] = useState<string>("");
  const { user } = useAuth();

  const { noOfGuests, name, phone } = bookingData;
  const { _id: id, price } = place;

  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(
          new Date(dateRange.to).setHours(0, 0, 0, 0),
          new Date(dateRange.from).setHours(0, 0, 0, 0)
        )
      : 0;

  const handleBookingData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: name === "noOfGuests" ? parseInt(value) || 0 : value,
    }));
  };

  const handleBooking = async () => {
    if (!user) {
      return setRedirect(`/login`);
    }

    if (numberOfNights < 1) {
      return toast.error("Please select valid dates");
    } else if (noOfGuests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (noOfGuests > place.maxGuests) {
      return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
    } else if (name.trim() === "") {
      return toast.error("Name can't be empty");
    } else if (phone.trim() === "") {
      return toast.error("Phone can't be empty");
    }

    try {
      const response = await axiosInstance.post("/bookings", {
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        noOfGuests,
        name,
        phone,
        place: id,
        price: numberOfNights * price,
      });

      const bookingId = response.data.booking._id;
      setRedirect(`/account/bookings/${bookingId}`);
      toast("Congratulations! Enjoy your trip.");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Booking Error: ", error);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="booking-widget-card">
      {/* Price Header */}
      <div className="price-header">
        <span className="price-amount">₹{place.price.toLocaleString()}</span>
        <span className="per-night"> / night</span>
      </div>

      {/* Date Selection */}
      <div className="booking-inputs-border">
        <div className="date-inputs">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>

        {/* Number of Guests */}
        <div className="input-box" style={{ borderTop: "1px solid #b0b0b0" }}>
          <label>GUESTS</label>
          <input
            type="number"
            name="noOfGuests"
            placeholder={`Max ${place.maxGuests} guests`}
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={handleBookingData}
          />
        </div>
      </div>

      {/* Guest Details */}
      <div className="guest-details-section">
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="booking-input"
            placeholder="Enter your full name"
            value={name}
            onChange={handleBookingData}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="booking-input"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleBookingData}
          />
        </div>
      </div>

      {/* Book Button */}
      <button onClick={handleBooking} className="book-btn">
        {numberOfNights > 0 ? (
          <>
            Reserve
            <span style={{ marginLeft: "8px", fontWeight: 700 }}>
              ₹{(numberOfNights * place.price).toLocaleString()}
            </span>
          </>
        ) : (
          "Check availability"
        )}
      </button>

      {/* Price Breakdown */}
      {numberOfNights > 0 && (
        <div className="price-breakdown">
          <div className="price-breakdown-row">
            <span>
              ₹{place.price.toLocaleString()} × {numberOfNights} nights
            </span>
            <span>₹{(numberOfNights * place.price).toLocaleString()}</span>
          </div>
          <div className="price-breakdown-divider"></div>
          <div className="price-breakdown-row price-breakdown-total">
            <span>Total</span>
            <span>₹{(numberOfNights * place.price).toLocaleString()}</span>
          </div>
        </div>
      )}

      <p className="booking-notice">You won't be charged yet</p>
    </div>
  );
};

export default BookingWidget;
