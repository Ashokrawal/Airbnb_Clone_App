import Place from "../models/Place.js";

// 1. Add a new listing
export const addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    });
    res.status(200).json({ place });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// 2. Get listings owned by the logged-in user
export const userPlaces = async (req, res) => {
  try {
    const { id } = req.user;
    res.status(200).json(await Place.find({ owner: id }));
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Update an existing listing
export const updatePlace = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.findById(id);

    // Security check: Only the owner can update the place
    if (userId === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        maxGuests,
        price,
      });
      await place.save();
      res.status(200).json({ message: "Place updated!" });
    } else {
      res.status(403).json({ message: "Unauthorized to update this place" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// 4. Get all listings (for the Home Page)

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6. Search for listings by address
export const searchPlaces = async (req, res) => {
  try {
    const { key } = req.params;
    if (!key || key === "") {
      return res.status(200).json(await Place.find());
    }
    // Using Regex for a case-insensitive "contains" search
    const searchMatches = await Place.find({
      address: { $regex: key, $options: "i" },
    });
    res.status(200).json(searchMatches);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// placeController.js - Update singlePlace
export const singlePlace = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "No ID provided" });
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let place;

    if (isValidObjectId) {
      place = await Place.findById(id).populate("owner", "name");
    } else {
      place = await Place.findOne({ photos: id }).populate("owner", "name");
    }

    if (!place) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // DO NOT transform photos here
    // leave them as public IDs for frontend to handle
    res.status(200).json({ place });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
