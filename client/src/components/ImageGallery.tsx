import React from "react";
import { Grid2x2 } from "lucide-react";
import "../styles/ImageGallary.css";

interface GalleryProps {
  photos: string[];
}

const ImageGallery: React.FC<GalleryProps> = ({ photos }) => {
  // Convert Cloudinary publicIds to full URLs
  const convertToCloudinaryUrl = (publicId: string) => {
    if (!publicId) return "https://via.placeholder.com/800";

    // If already a full URL, return it
    if (publicId.startsWith("http")) return publicId;

    // Convert publicId to optimized Cloudinary URL
    return `https://res.cloudinary.com/djcgonxur/image/upload/f_auto,q_auto,w_800,c_limit/${publicId}`;
  };

  const displayPhotos = photos?.slice(0, 5) || [];

  return (
    <div className="gallery-container">
      <div className="gallery-main">
        <img
          src={convertToCloudinaryUrl(displayPhotos[0])}
          alt="Primary"
          className="gallery-img"
        />
      </div>
      <div className="gallery-side">
        {displayPhotos.slice(1).map((photo, index) => (
          <div key={index} className="gallery-side-item">
            <img
              src={convertToCloudinaryUrl(photo)}
              alt={`Side ${index}`}
              className="gallery-img"
            />
          </div>
        ))}
      </div>
      <button className="show-all-btn">
        <Grid2x2 size={16} /> Show all photos
      </button>
    </div>
  );
};

export default ImageGallery;
