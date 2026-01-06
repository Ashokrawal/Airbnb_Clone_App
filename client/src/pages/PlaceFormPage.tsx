import * as React from "react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "@/utils/axios";

import AccountNavigation from "@/components/AccontNavigation";
import Perks from "@/components/Perks";
import PhotosUploader from "@/components/PhotoUploader";
import Spinner from "@/components/Spinner";

// 1. Define the Interface for the Place form data
interface PlaceFormData {
  title: string;
  address: string;
  description: string;
  perks: string[];
  extraInfo: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  price: number;
}

const PlacesFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [redirect, setRedirect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);

  // 2. Explicitly type the form state
  const [formData, setFormData] = useState<PlaceFormData>({
    title: "",
    address: "",
    description: "",
    perks: [],
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 10,
    price: 500,
  });

  const { title, address, description, perks, extraInfo, maxGuests, price } =
    formData;

  const isValidPlaceData = (): boolean => {
    if (title.trim() === "") {
      toast.error("Title can't be empty!");
      return false;
    } else if (address.trim() === "") {
      toast.error("Address can't be empty!");
      return false;
    } else if (addedPhotos.length < 5) {
      toast.error("Upload at least 5 photos!");
      return false;
    } else if (description.trim() === "") {
      toast.error("Description can't be empty!");
      return false;
    } else if (maxGuests < 1) {
      toast.error("At least one guest is required!");
      return false;
    } else if (maxGuests > 10) {
      toast.error("Max. guests can't be greater than 10");
      return false;
    }
    return true;
  };

  // 3. Typed Change Handler (supports input and textarea)
  const handleFormData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes (Perks)
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const currentPerks = [...perks];
      const updatedPerks = checkbox.checked
        ? [...currentPerks, name]
        : currentPerks.filter((perk) => perk !== name);

      setFormData({ ...formData, perks: updatedPerks });
      return;
    }

    // Handle number inputs
    const val = type === "number" ? parseInt(value) || 0 : value;
    setFormData({ ...formData, [name]: val });
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;

      // Update formData keys safely
      setFormData((prev) => ({
        ...prev,
        title: place.title || "",
        address: place.address || "",
        description: place.description || "",
        perks: place.perks || [],
        extraInfo: place.extraInfo || "",
        checkIn: place.checkIn || "",
        checkOut: place.checkOut || "",
        maxGuests: place.maxGuests || 10,
        price: place.price || 500,
      }));

      setAddedPhotos([...place.photos]);
      setLoading(false);
    });
  }, [id]);

  const savePlace = async (e: FormEvent) => {
    e.preventDefault();

    if (isValidPlaceData()) {
      const placeData = { ...formData, photos: addedPhotos };
      try {
        if (id) {
          await axiosInstance.put("/places/update-place", { id, ...placeData });
        } else {
          await axiosInstance.post("/places/add-places", placeData);
        }
        setRedirect(true);
      } catch (err) {
        toast.error("Failed to save place.");
      }
    }
  };

  if (redirect) return <Navigate to={"/account/places"} />;
  if (loading) return <Spinner />;

  const preInput = (header: string, description: string) => (
    <>
      <h2 className="mt-4 text-2xl">{header}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </>
  );

  return (
    <div className="p-4">
      <AccountNavigation />
      <form onSubmit={savePlace}>
        {preInput("Title", "Catchy title for your place")}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="title, for example: My lovely apt"
        />

        {preInput("Address", "Physical address")}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="address"
        />

        {preInput("Photos", "At least 5 photos")}
        <PhotosUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />

        {preInput("Description", "Describe the features")}
        <textarea
          name="description"
          value={description}
          onChange={handleFormData}
        />

        {preInput("Perks", "Select features")}
        <Perks selected={perks} handleFormData={handleFormData} />

        {preInput("Extra info", "House rules, etc.")}
        <textarea
          name="extraInfo"
          value={extraInfo}
          onChange={handleFormData}
        />

        {preInput("Number of guests & Price", "Limits and nightly rate")}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Max no. of guests</h3>
            <input
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
            />
          </div>
        </div>
        <button className="mx-auto my-4 flex rounded-full bg-primary py-3 px-20 text-xl font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
