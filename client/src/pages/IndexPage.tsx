import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/IndexPage.css";

const CLOUD_LINK = "http://localhost:8000/api/v1/user/folder/home/photos";

// 1. Move the sub-component outside to prevent re-creation on every render
const SectionSlider = ({
  title,
  data,
  id,
}: {
  title: string;
  data: any[];
  id: string;
}) => (
  <div className="slider-section">
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <div className="custom-nav-container hide-on-mobile">
        <button className={`nav-btn prev-${id}`}>
          <svg
            viewBox="0 0 32 32"
            className="nav-icon"
            fill="none"
            stroke="currentColor"
          >
            <path d="M20 28L8 16L20 4" />
          </svg>
        </button>
        <button className={`nav-btn next-${id}`}>
          <svg
            viewBox="0 0 32 32"
            className="nav-icon"
            fill="none"
            stroke="currentColor"
          >
            <path d="M12 28L24 16L12 4" />
          </svg>
        </button>
      </div>
    </div>

    <Swiper
      modules={[Navigation]}
      spaceBetween={12}
      slidesPerView={2}
      navigation={{
        prevEl: `.prev-${id}`,
        nextEl: `.next-${id}`,
      }}
      breakpoints={{
        768: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 5, spaceBetween: 20 },
        1200: { slidesPerView: 7, spaceBetween: 20 },
      }}
      className="listing-swiper"
    >
      {data.map((img) => (
        <SwiperSlide key={img.publicId}>
          <div className="listing-card">
            <div className="image-container">
              {/* Cloudinary optimization: ar_1:1,c_fill is great for uniform cards */}
              <img
                src={img.url.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_500,ar_1:1,c_fill/"
                )}
                alt="Listing"
                loading="lazy" // 2. Add native lazy loading
              />
              <button className="heart-button">
                <svg viewBox="0 0 32 32">
                  <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                </svg>
              </button>
            </div>
            <div className="listing-info">
              <span className="location-title">
                Room in {img.publicId.split("/").pop()?.split("-")[0]}
              </span>
              <p className="subtitle2">Oct 22-27 • Individual host </p>
              <div className="price-row">
                <span className="subtitle">₹{img.price || 1500} per night</span>
                <span className="rating-pill">★{img.rating || 4.8}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

const IndexPage: React.FC = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(CLOUD_LINK);
        if (data.success) {
          // 3. Attach stable random values once so they don't change on re-render
          const enhancedImages = data.images.map((img: any) => ({
            ...img,
            price: Math.floor(Math.random() * 2500) + 1200,
            rating: `4.${Math.floor(Math.random() * 8) + 2}`,
          }));
          setImages(enhancedImages);
        }
      } catch (err) {
        console.error("Failed to fetch images", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <Spinner />;

  return (
    <main className="airbnb-page-wrapper">
      <SectionSlider
        title="Popular homes in London"
        data={images}
        id="london"
      />
      <div className="section-spacer" />
      {/* 4. Fixed duplicate IDs */}
      <SectionSlider
        title="Explore stays in New York"
        data={images}
        id="newyork"
      />
      <div className="section-spacer" />
      <SectionSlider title="Explore stays in China" data={images} id="china" />
      <div className="section-spacer" />
      <SectionSlider title="Explore stays in Nepal" data={images} id="nepal" />
    </main>
  );
};

export default IndexPage;
