import * as React from "react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/dialog";

import { Input } from "@/components/input";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { Avatar, AvatarImage } from "@/components/Avatar";
import { Loader2, PenSquare, Upload } from "lucide-react";
import { useAuth } from "@/hooks";

// 1. Define the User and API Response shapes
interface User {
  name: string;
  picture?: string;
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

  // 2. Properly type the refs and state
  const uploadRef = useRef<HTMLInputElement>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    name: user.name || "",
    password: "",
    confirm_password: "",
  });

  const handleImageClick = () => {
    uploadRef.current?.click();
  };

  // 3. Type the event handlers
  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
    }
  };

  const handleUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, password, confirm_password } = userData;

    if (name.trim() === "") {
      setLoading(false);
      return toast.error("Name Can't be empty");
    } else if (password !== confirm_password) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }

    try {
      let pictureUrl = user.picture || "";

      if (picture) {
        // Since 'picture' is a File object, upload it
        pictureUrl = await uploadPicture(picture);
      }

      const userDetails = {
        name: userData.name,
        password: userData.password,
        picture: pictureUrl,
      };

      const res = await updateUser(userDetails);
      if (res.success) {
        setUser(res.user);
        toast.success("Updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-600">
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex justify-center">
          <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10"
              onClick={handleImageClick}
            >
              <input
                type="file"
                className="hidden"
                ref={uploadRef}
                onChange={handlePictureChange}
                accept="image/*"
              />
              <Upload height={50} width={50} color="#4e4646" />
            </div>

            {/* Use URL.createObjectURL safely */}
            <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden h-full w-full">
              <AvatarImage
                src={picture ? URL.createObjectURL(picture) : user.picture}
                alt="Profile Preview"
                className="object-cover"
              />
            </Avatar>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              className="col-span-3"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              value={userData.password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              value={userData.confirm_password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            type="submit"
            className="w-full"
            onClick={handleSaveChanges}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
