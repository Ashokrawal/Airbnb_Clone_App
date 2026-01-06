import React, { useEffect, useState, type ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks";
import axiosInstance from "@/utils/axios";
import DatePickerWithRange from "./DatePickerWithRange";

// 1. Define types for the Place and User
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
  const { user } = useAuth(); // Assuming useAuth returns { user: { name: string } | null }

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

  /**
   * Typed event handler for input changes
   */
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

    // Validation Logic
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
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="text-center text-xl">
        Price: <span className="font-semibold">₹{place.price}</span> / per night
      </div>
      <div className="mt-4 rounded-2xl border">
        <div className="flex w-full ">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
        <div className="border-t py-3 px-4">
          <label className="text-sm font-semibold">Number of guests: </label>
          <input
            type="number"
            name="noOfGuests"
            className="w-full mt-1 border rounded-lg px-2 py-1"
            placeholder={`Max. guests: ${place.maxGuests}`}
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={handleBookingData}
          />
        </div>
        <div className="border-t py-3 px-4">
          <label className="text-sm font-semibold">Your full name: </label>
          <input
            type="text"
            name="name"
            className="w-full mt-1 mb-2 border rounded-lg px-2 py-1"
            value={name}
            onChange={handleBookingData}
          />
          <label className="text-sm font-semibold">Phone number: </label>
          <input
            type="tel"
            name="phone"
            className="w-full mt-1 border rounded-lg px-2 py-1"
            value={phone}
            onChange={handleBookingData}
          />
        </div>
      </div>
      <button onClick={handleBooking} className="primary mt-4 w-full">
        Book this place
        {numberOfNights > 0 && (
          <span className="ml-1 font-bold">
            {" "}
            ₹{numberOfNights * place.price}
          </span>
        )}
      </button>
    </div>
  );
};

export default BookingWidget;
