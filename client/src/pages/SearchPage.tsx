import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../styles/SearchPage.css";

// Fix for default Leaflet icon missing in build tools
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const SearchPage: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Use your actual Cloudinary link here
        const { data } = await axios.get("YOUR_CLOUD_LINK");
        if (data.success) setImages(data.images);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const center: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div className="search-page-container">
      {/* LEFT SIDE: LISTINGS */}
      <section className="listings-column">
        <div className="results-info">
          <p>{images.length} stays in Paris</p>
          <h1>Stays in Paris</h1>
          <div className="filter-pills">
            <button className="filter-pill">Type of place</button>
            <button className="filter-pill">Price</button>
            <button className="filter-pill">Instant Book</button>
          </div>
        </div>

        <div className="listings-grid">
          {images.map((img) => (
            <div className="search-listing-card" key={img.publicId}>
              <div className="image-wrapper">
                <img
                  src={img.url.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_600/"
                  )}
                  alt="Listing"
                />
                <button className="heart-btn-overlay">
                  <svg viewBox="0 0 32 32">
                    <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                  </svg>
                </button>
              </div>
              <div className="listing-details">
                <div className="top-row">
                  <span className="location-text">
                    Entire rental unit in Paris
                  </span>
                  <span className="rating">★ 4.92</span>
                </div>
                <h3 className="listing-name">
                  Room in {img.publicId.split("/").pop()}
                </h3>
                <p className="amenities">
                  2 guests · 1 bedroom · 1 bed · 1 bath
                </p>
                <div className="price-bottom">
                  <p className="price-text">
                    <strong>₹{Math.floor(Math.random() * 2500) + 1200}</strong>{" "}
                    / night
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT SIDE: FREE MAP */}
      <section className="map-column">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Using CartoDB Positron - It's light, clean, and Airbnb-like */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {images.slice(0, 10).map((img, index) => (
            <Marker
              key={index}
              position={[center[0] + index * 0.005, center[1] + index * 0.005]}
            >
              <Tooltip permanent direction="top" className="custom-map-label">
                ₹{Math.floor(Math.random() * 2000) + 1000}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
};

export default SearchPage;
