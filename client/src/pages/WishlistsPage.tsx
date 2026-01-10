import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import "../styles/WishlistsPage.css";

const CLOUD_LINK = "http://localhost:8000/api/v1/user/folder/home/photos";

interface ListingImage {
  publicId: string;
  url: string;
}

export const WishlistsPage = () => {
  const [savedStays, setSavedStays] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterWishlist = async () => {
      try {
        // 1. Get IDs from localStorage
        const savedIds: string[] = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        if (savedIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch all images to get the URLs/Details
        const { data } = await axios.get(CLOUD_LINK);

        if (data?.success) {
          // 3. Filter the API results to only include IDs in the wishlist
          const filtered = data.images.filter((img: ListingImage) =>
            savedIds.includes(img.publicId)
          );
          setSavedStays(filtered);
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterWishlist();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="wishlist-container">
      <header className="wishlist-header">
        <h1 className="page-title">Wishlists</h1>
      </header>

      {savedStays.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Create your first wishlist</h2>
          <p>
            As you search, click the heart icon to save your favorite places.
          </p>
          <Link to="/" className="explore-btn">
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {/* Main Collection Card (Airbnb Style) */}
          <Link to="/wishlist/all" className="wishlist-card-link">
            <div className="wishlist-card">
              <div className="wishlist-img-stack">
                {/* Large Main Image */}
                <div
                  className="main-img"
                  style={{
                    backgroundImage: `url(${savedStays[0]?.url || ""})`,
                  }}
                />

                {/* Secondary Images Column */}
                <div className="side-imgs">
                  <div
                    className="side-img"
                    style={{
                      backgroundImage: `url(${savedStays[1]?.url || savedStays[0]?.url})`,
                    }}
                  />
                  <div
                    className="side-img"
                    style={{
                      backgroundImage: `url(${savedStays[2]?.url || savedStays[0]?.url})`,
                    }}
                  />
                </div>
              </div>

              <div className="wishlist-info">
                <h3 className="wishlist-name">All saved stays</h3>
                <p className="wishlist-count">
                  {savedStays.length} stays saved
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
