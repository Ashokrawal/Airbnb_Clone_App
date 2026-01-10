import * as React from "react";
import { useRef, useState, useEffect, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";

import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { Avatar, AvatarImage } from "@/components/Avatar";
import { Loader2, PenSquare, Upload } from "lucide-react";
import { useAuth } from "@/hooks";

interface User {
  name: string;
  picture?: string;
  email?: string;
}

interface UpdateResponse {
  success: boolean;
  user: User;
}

const EditProfileDialog: React.FC = () => {
  const { user, setUser, uploadPicture, updateUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void;
    uploadPicture: (file: File) => Promise<string>;
    updateUser: (data: any) => Promise<UpdateResponse>;
  };

  const uploadRef = useRef<HTMLInputElement>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    user.picture
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    name: user.name || "",
    password: "",
    confirm_password: "",
  });

  // Handle image preview and clean up memory leaks
  useEffect(() => {
    if (!picture) {
      setPreviewUrl(user.picture);
      return;
    }
    const objectUrl = URL.createObjectURL(picture);
    setPreviewUrl(objectUrl);

    // Clean up memory when component unmounts or picture changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [picture, user.picture]);

  const handleImageClick = () => uploadRef.current?.click();

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPicture(file);
  };

  const handleUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, password, confirm_password } = userData;

    if (!name.trim()) {
      setLoading(false);
      return toast.error("Name can't be empty");
    }

    if (password && password !== confirm_password) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }

    try {
      let pictureUrl = user.picture || "";
      if (picture) {
        pictureUrl = await uploadPicture(picture);
      }

      // Only send password if user intended to change it
      const userDetails: any = {
        name: userData.name,
        picture: pictureUrl,
        email: user.email, // Backend needs email to find the user
      };

      if (password) userDetails.password = password;

      const res = await updateUser(userDetails);
      if (res.success) {
        setUser(res.user);
        toast.success("Profile updated!");
        // Clear passwords after success
        setUserData((prev) => ({
          ...prev,
          password: "",
          confirm_password: "",
        }));
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Styled to be slim and professional */}
        <Button
          variant="outline"
          className="border-zinc-800 text-zinc-800 hover:bg-zinc-50 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] rounded-3xl p-8">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">Edit personal info</h2>

          {/* Avatar Upload UI */}
          <div
            className="relative group h-32 w-32 cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
              <Upload size={24} />
            </div>

            <div className="h-full w-full rounded-full overflow-hidden border border-zinc-200 bg-zinc-100">
              <img
                src={previewUrl}
                referrerPolicy="no-referrer"
                alt="Profile Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${user.name}`;
                }}
              />
            </div>

            <input
              type="file"
              className="hidden"
              ref={uploadRef}
              onChange={handlePictureChange}
              accept="image/*"
            />
          </div>
        </div>

        <div className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Legal Name</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={handleUserData}
              placeholder="First and Last name"
              className="h-12 rounded-xl focus-visible:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleUserData}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={userData.confirm_password}
                onChange={handleUserData}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button
            disabled={loading}
            onClick={handleSaveChanges}
            className="w-full h-12 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-lg"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
