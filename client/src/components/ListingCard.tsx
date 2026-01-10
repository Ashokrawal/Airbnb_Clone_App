import React from "react";
import { Link } from "react-router-dom";

interface ListingCardProps {
  id: string;
  url: string;
  price?: number;
  rating?: string | number;
  isFavorited?: boolean;
  onToggleWishlist?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  url,
  price = 1500,
  rating = 4.8,
  isFavorited = false,
  onToggleWishlist,
}) => {
  // Professional Title Formatting
  const title =
    id
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Beautiful Stay";

  // Cloudinary Optimization
  const optimizedUrl = url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_600,ar_1:1,c_fill/"
  );

  return (
    <div className="listing-card group flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Link
          to={`/place?id=${encodeURIComponent(id)}`}
          className="block w-full h-full"
        >
          <img
            src={optimizedUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist?.(id);
          }}
          className="absolute top-3 right-3 p-1 hover:scale-110 transition-transform"
          aria-label="Wishlist"
        >
          <svg
            viewBox="0 0 32 32"
            className={`w-6 h-6 transition-colors duration-200 stroke-white stroke-[2px] ${
              isFavorited ? "fill-[#ff385c] stroke-[#ff385c]" : "fill-black/40"
            }`}
          >
            <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col px-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[15px] truncate text-gray-900">
            {title}
          </h3>
          <span className="flex items-center gap-1 text-sm">★ {rating}</span>
        </div>
        <p className="text-gray-500 text-[14px]">Individual host • Oct 22-27</p>
        <p className="mt-1 text-[15px]">
          <span className="font-bold">₹{price}</span>
          <span className="text-gray-600 font-light"> night</span>
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
