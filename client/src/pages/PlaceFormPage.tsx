import * as React from "react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "@/utils/axios";

import Perks from "@/components/Perks";
import PhotosUploader from "@/components/PhotoUploader";
import Spinner from "@/components/Spinner";
import "../styles/PlacesFormPage.css";

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
    if (!title.trim()) return toast.error("Title can't be empty!");
    if (!address.trim()) return toast.error("Address can't be empty!");
    if (addedPhotos.length < 5) return toast.error("Upload at least 5 photos!");
    if (!description.trim()) return toast.error("Description can't be empty!");
    if (maxGuests < 1) return toast.error("At least one guest is required!");
    if (maxGuests > 10)
      return toast.error("Max guests can't be greater than 10");
    return true;
  };

  const handleFormData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const updatedPerks = checkbox.checked
        ? [...perks, name]
        : perks.filter((perk) => perk !== name);
      setFormData({ ...formData, perks: updatedPerks });
      return;
    }

    const val = type === "number" ? parseInt(value) || 0 : value;
    setFormData({ ...formData, [name]: val });
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((res) => {
      const { place } = res.data;
      setFormData({
        title: place.title || "",
        address: place.address || "",
        description: place.description || "",
        perks: place.perks || [],
        extraInfo: place.extraInfo || "",
        checkIn: place.checkIn || "",
        checkOut: place.checkOut || "",
        maxGuests: place.maxGuests || 10,
        price: place.price || 500,
      });
      setAddedPhotos([...place.photos]);
      setLoading(false);
    });
  }, [id]);

  const savePlace = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPlaceData()) return;

    const placeData = { ...formData, photos: addedPhotos };
    try {
      if (id)
        await axiosInstance.put("/places/update-place", { id, ...placeData });
      else await axiosInstance.post("/places/add-places", placeData);
      setRedirect(true);
    } catch {
      toast.error("Failed to save place.");
    }
  };

  if (redirect) return <Navigate to={"/account/places"} />;
  if (loading) return <Spinner />;

  const preInput = (header: string, description: string) => (
    <>
      <h2>{header}</h2>
      <p className="text-sm">{description}</p>
    </>
  );

  return (
    <div className="places-form-page-container">
      <form onSubmit={savePlace}>
        {preInput("Title", "Catchy title for your place")}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="Title, for example: My lovely apt"
        />

        {preInput("Address", "Physical address")}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="Address"
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
        <div className="grid">
          <div>
            <h3>Max no. of guests</h3>
            <input
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
            />
          </div>
          <div>
            <h3>Price per night</h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
            />
          </div>
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
