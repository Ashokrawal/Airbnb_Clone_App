import * as React from "react";
import { useState } from "react";

// 1. Define the interface for the place data
interface Place {
  photos?: string[];
  title?: string;
}

interface PlaceGalleryProps {
  place: Place;
}

const PlaceGallery: React.FC<PlaceGalleryProps> = ({ place }) => {
  const [showAllPhotos, setShowAllPhotos] = useState<boolean>(false);

  // 2. Full-screen Modal View
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-white">
        <div className="grid gap-4 bg-white px-4 py-20 md:p-8 max-w-3xl mx-auto">
          <div>
            <button
              className="fixed right-4 top-8 flex items-center gap-1 rounded-2xl bg-gray-100 py-2 px-4 text-black shadow-md hover:bg-gray-200 transition-all md:right-12"
              onClick={() => setShowAllPhotos(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Close photos</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Photos of {place.title}
          </h2>
          {place?.photos &&
            place.photos.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index} className="w-full">
                <img
                  src={photo}
                  alt={`${place.title} - ${index}`}
                  className="w-full rounded-lg"
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  // 3. Grid View (Main Display)
  return (
    <div className="relative">
      {/* Desktop Grid (3 columns, 4 photos) */}
      <div className="hidden h-[400px] max-h-[450px] grid-cols-4 gap-2 overflow-hidden rounded-[12px] md:grid">
        {/* Main large image */}
        <div className="col-span-2 overflow-hidden">
          {place.photos?.[0] && (
            <div className="h-full w-full bg-gray-100">
              <img
                onClick={() => setShowAllPhotos(true)}
                className="h-full w-full cursor-pointer object-cover hover:brightness-90 transition-all"
                src={place.photos[0]}
                alt=""
              />
            </div>
          )}
        </div>

        {/* Column 2: Two smaller stacked images */}
        <div className="col-span-1 overflow-hidden">
          <div className="grid h-full grid-rows-2 gap-2">
            {[1, 2].map(
              (idx) =>
                place.photos?.[idx] && (
                  <div key={idx} className="bg-gray-100 overflow-hidden">
                    <img
                      onClick={() => setShowAllPhotos(true)}
                      className="h-full w-full cursor-pointer object-cover hover:brightness-90 transition-all"
                      src={place.photos[idx]}
                      alt=""
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* Column 3: Two smaller stacked images */}
        <div className="col-span-1 overflow-hidden">
          <div className="grid h-full grid-rows-2 gap-2">
            {[3, 4].map(
              (idx) =>
                place.photos?.[idx] && (
                  <div key={idx} className="h-full bg-gray-100 overflow-hidden">
                    <img
                      onClick={() => setShowAllPhotos(true)}
                      className="h-full w-full cursor-pointer object-cover hover:brightness-90 transition-all"
                      src={place.photos[idx]}
                      alt=""
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Mobile View: Single Image */}
      <div className="flex overflow-hidden rounded-[12px] md:hidden aspect-video">
        {place.photos?.[0] && (
          <img
            onClick={() => setShowAllPhotos(true)}
            className="w-full cursor-pointer object-cover"
            src={place.photos[0]}
            alt=""
          />
        )}
      </div>

      {/* "Show All" Button */}
      <button
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white py-1.5 px-3 shadow-md border border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => setShowAllPhotos(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold">Show all photos</span>
      </button>
    </div>
  );
};

export default PlaceGallery;
