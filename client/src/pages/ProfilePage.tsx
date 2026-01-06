import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useParams } from "react-router-dom";

import AccountNavigation from "@/components/AccontNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";

import PlacesPage from "./PlacesPage";
import { useAuth } from "@/hooks"; // Using the barrel export
import { LogOut, Mail, Text } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  // 1. Type the redirect state - either a path string or null
  const [redirect, setRedirect] = useState<string | null>(null);

  // 2. useParams is generic, we expect 'subpage'
  let { subpage } = useParams<{ subpage: string }>();

  if (!subpage) {
    subpage = "profile";
  }

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success(response.message);
      setRedirect("/");
    } else {
      toast.error(response.message);
    }
  };

  // 3. Handle the "null" user case early (Type Guard)
  if (!user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  // At this point, TS knows 'user' is NOT null because of the check above
  return (
    <div>
      <AccountNavigation />
      {subpage === "profile" && user && (
        <div className="m-4 flex flex-col items-center gap-8 rounded-[10px] p-4 sm:h-1/5 sm:flex-row sm:items-stretch lg:gap-28 lg:pl-32 lg:pr-20">
          <div className="flex h-40 w-40 justify-center rounded-full bg-gray-200 p-4 sm:h-72 sm:w-72 md:h-96 md:w-96">
            <Avatar className="h-full w-full">
              {user.picture ? (
                <AvatarImage src={user.picture} className="object-cover" />
              ) : (
                <AvatarImage
                  src="https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png"
                  className="object-cover"
                />
              )}
              <AvatarFallback>
                {user.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex grow flex-col items-center gap-10 sm:items-start sm:justify-around sm:gap-0">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="flex items-center gap-2">
                <Text height="18" width="18" />
                <div className="text-xl">
                  <span>Name: </span>
                  <span className="text-gray-600">{user.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail height="18" width="18" />
                <div className="text-xl">
                  <span>Email: </span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-around sm:justify-end sm:gap-5 md:gap-10">
              <EditProfileDialog />
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;
