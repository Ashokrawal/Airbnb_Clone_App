import * as React from "react";
import { useState, type ChangeEvent, type MouseEvent } from "react";

import Image from "./Image";
import axiosInstance from "@/utils/axios";
import "../styles/PhotosUploader.css";

// 1. Define Props Interface
interface PhotosUploaderProps {
  addedPhotos: string[];
  setAddedPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const PhotosUploader: React.FC<PhotosUploaderProps> = ({
  addedPhotos,
  setAddedPhotos,
}) => {
  const [photoLink, setphotoLink] = useState<string>("");

  /**
   * Adds a photo by sending a URL string to the backend
   */
  const addPhotoByLink = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!photoLink.trim()) return;

    try {
      const { data: filename } = await axiosInstance.post<string>(
        "/upload-by-link",
        {
          link: photoLink,
        }
      );
      setAddedPhotos((prev) => [...prev, filename]);
      setphotoLink("");
    } catch (err) {
      console.error("Link upload failed", err);
    }
  };

  /**
   * Handles local file uploads using FormData
   */
  const uploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    try {
      const { data: filenames } = await axiosInstance.post<string[]>(
        "/upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAddedPhotos((prev) => [...prev, ...filenames]);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const removePhoto = (filename: string) => {
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== filename)]);
  };

  const selectAsMainPhoto = (
    e: MouseEvent<HTMLButtonElement>,
    filename: string
  ) => {
    e.preventDefault();
    // Move the selected filename to the front of the array
    setAddedPhotos([
      filename,
      ...addedPhotos.filter((photo) => photo !== filename),
    ]);
  };

  return (
    <>
      <div className="photo-link-input">
        <input
          value={photoLink}
          onChange={(e) => setphotoLink(e.target.value)}
          type="text"
          placeholder="Add using a link ...jpg"
        />
        <button onClick={addPhotoByLink}>Add photo</button>
      </div>

      <div className="photos-grid">
        {addedPhotos?.map((link) => (
          <div className="photo-item" key={link}>
            <Image src={link} alt="Uploaded preview" />
            <button className="delete-btn" onClick={() => removePhoto(link)}>
              {/* SVG Trash */}
            </button>
            <button
              className={`main-btn ${link === addedPhotos[0] ? "active" : ""}`}
              onClick={(e) => selectAsMainPhoto(e, link)}
            >
              {/* SVG Star */}
            </button>
          </div>
        ))}
        <label className="upload-label">
          <input
            type="file"
            multiple
            hidden
            onChange={uploadPhoto}
            accept="image/*"
          />
          {/* SVG + Upload */}
        </label>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos?.length > 0 &&
          addedPhotos.map((link) => (
            <div className="relative flex h-32" key={link}>
              <Image
                className="w-full rounded-2xl object-cover"
                src={link}
                alt="Uploaded preview"
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removePhoto(link)}
                className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
              {/* "Make Main" (Star) Button */}
              <button
                type="button"
                onClick={(e) => selectAsMainPhoto(e, link)}
                className="absolute bottom-1 left-1 cursor-pointer rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
              >
                {link === addedPhotos[0] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        {/* Upload Label / Button */}
        <label className="flex h-32 cursor-pointer items-center justify-center gap-1 rounded-2xl border bg-transparent p-2 text-2xl text-gray-600 hover:bg-gray-50 transition-colors">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
            accept="image/*"
          />
          Upload
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;
