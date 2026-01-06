import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AccountNavigation from "@/components/AccontNavigation";
import Spinner from "../components/Spinner";
import axiosInstance from "../utils/axios";

// 1. Define the Booking Interface
// This ensures TS knows that booking.place.title is valid
interface Booking {
  _id: string;
  price: number;
  place: {
    title: string;
    address: string;
    photos: string[];
    description: string;
  };
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
}

const SingleBookedPlace: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 2. Initialize state as null or Booking (not an empty object {})
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getBookings = async () => {
    try {
      setLoading(true);
      // Explicitly typing the axios response
      const { data } = await axiosInstance.get<{ booking: Booking[] }>(
        "/bookings"
      );

      const filteredBooking = data.booking.find((b) => b._id === id);

      setBooking(filteredBooking || null);
    } catch (error) {
      console.error("Error fetching booking: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBookings();
    }
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  // 3. Simple Type Guard
  if (!booking) {
    return (
      <div>
        <AccountNavigation />
        <h1 className="mt-10 text-center text-2xl font-semibold">
          Booking not found
        </h1>
      </div>
    );
  }

  return (
    <div>
      <AccountNavigation />
      <div className="p-4">
        <h1 className="text-3xl">{booking.place.title}</h1>

        <AddressLink
          className="my-2 block"
          placeAddress={booking.place.address}
        />

        <div className="my-6 flex flex-col items-center justify-between rounded-2xl bg-gray-200 p-6 sm:flex-row">
          <div>
            <h2 className="mb-4 text-2xl md:text-2xl">
              Your booking information
            </h2>
            <BookingDates booking={booking} />
          </div>
          <div className="mt-5 w-full rounded-2xl bg-primary p-6 text-white sm:mt-0 sm:w-auto">
            <div className="hidden md:block">Total price</div>
            <div className="flex justify-center text-3xl">
              <span>₹{booking.price}</span>
            </div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
};

export default SingleBookedPlace;
