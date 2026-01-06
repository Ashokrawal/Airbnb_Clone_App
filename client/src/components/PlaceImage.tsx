import * as React from "react";

// 1. Define the shape of the Place object
interface Place {
  photos?: string[];
  title?: string; // Good practice for alt tags
}

// 2. Define the component props
interface PlaceImageProps {
  place: Place;
  index?: number;
  className?: string;
}

const PlaceImage: React.FC<PlaceImageProps> = ({
  place,
  index = 0,
  className = "object-cover", // Default value assigned here
}) => {
  // 3. Safety check: Ensure photos exist and the specific index exists
  if (!place.photos?.length || !place.photos[index]) {
    return null; // React components should return null instead of an empty string
  }

  return (
    <img
      src={place.photos[index]}
      alt={place.title || ""}
      className={className}
    />
  );
};

export default PlaceImage;
