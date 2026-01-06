import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "@/utils/axios";

// Import the Place interface from your central types or define it here
import { type Place } from "@/hooks";

import Spinner from "@/components/Spinner";
import AddressLink from "@/components/AddressLink";
import BookingWidget from "@/components/BookingWidget";
import PlaceGallery from "@/components/PlaceGallery";
import PerksWidget from "@/components/PerksWidget";

// 1. Define the API response shape
interface PlaceResponse {
  place: Place;
}

const PlacesPage: React.FC = () => {
  // 2. useParams is generic, so we type 'id'
  const { id } = useParams<{ id: string }>();

  // 3. Explicitly type the state
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const getPlace = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<PlaceResponse>(
          `/places/${id}`
        );
        setPlace(data.place);
      } catch (error) {
        console.error("Error fetching place:", error);
      } finally {
        setLoading(false);
      }
    };

    getPlace();
  }, [id]);

  if (loading) return <Spinner />;

  // 4. Type guard: if place is null, don't render the UI
  if (!place) return null;

  return (
    <div className="mt-4 overflow-x-hidden px-8 pt-20">
      <h1 className="text-3xl">{place.title}</h1>

      <AddressLink placeAddress={place.address} />
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="whitespace-pre-line">{place.description}</p>
          </div>
          <div className="font-medium">
            Max number of guests: {place.maxGuests}
          </div>
          <PerksWidget perks={place.perks} />
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 border-t bg-white px-8 py-8">
        <div>
          <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm leading-5 text-gray-700 whitespace-pre-line">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
