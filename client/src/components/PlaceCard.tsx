import * as React from "react";
import { Link } from "react-router-dom";

export interface Place {
  _id: string;
  photos: string[];
  address: string;
  title: string;
  price: number;
}

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;

  return (
    <Link
      to={`/place?id=${placeId}`}
      className="group m-4 flex flex-col md:m-2 xl:m-0 transition-transform duration-200 hover:scale-[1.02]"
    >
      <div className="flex flex-col gap-1">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
          {photos?.[0] ? (
            <img
              src={photos[0]}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="mt-2">
          <h2 className="truncate font-bold text-gray-800">{address}</h2>
          <h3 className="truncate text-sm text-gray-500">{title}</h3>
          <div className="mt-1 text-sm md:text-base">
            <span className="font-bold text-gray-900">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-gray-600"> per night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
