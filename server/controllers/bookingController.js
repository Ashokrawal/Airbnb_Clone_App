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

// 2. Get all bookings for the logged-in user
export const getBookings = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({
        error: "You are not authorized to access this page!",
      });
    }

    // .populate('place') is the magic here—it grabs the full House details
    // from the Places collection instead of just showing an ID number.
    const bookings = await Booking.find({ user: userData.id }).populate(
      "place"
    );

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
