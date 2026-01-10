import Booking from "../models/Booking.js";

// 1. Create a new booking
export const createBookings = async (req, res) => {
  try {
    const userData = req.user; // Provided by your isLoggedIn middleware
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    });

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// In controllers/bookingController.js
export const getBookings = async (req, res) => {
  try {
    const userData = req.user;
    const bookings = await Booking.find({ user: userData.id }).populate(
      "place"
    );

    res.status(200).json({
      success: true,
      booking: bookings, // Changed 'bookings' to 'booking' to match your frontend
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
