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
    res.status(200).json(await Place.find());
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Get a specific listing by ID
export const singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.status(200).json({ place });
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
