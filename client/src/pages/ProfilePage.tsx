import React, { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks";
import { LogOut, Mail, User, ShieldCheck, Camera } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
import "@/styles/ProfilePage.css";

// Interface for TypeScript safety
interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout, loading } = useAuth() as {
    user: UserProfile | null;
    logout: () => any;
    loading: boolean;
  };

  const [redirect, setRedirect] = useState<string | null>(null);

  let { subpage } = useParams<{ subpage: string }>();

  if (!subpage) subpage = "profile";

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success(response.message);
      setRedirect("/");
    } else {
      toast.error(response.message);
    }
  };

  // 1. Wait for the hook to finish reading localStorage
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
      </div>
    );
  }

  // 2. Now it's safe to redirect if there's still no user
  if (!user && !redirect) return <Navigate to={"/login"} />;

  if (redirect) return <Navigate to={redirect} />;

  console.log("Current User Data:", user);
  console.log("Profile Picture URL:", user?.picture);

  return (
    <main className="profile-page-wrapper">
      <div className="profile-container">
        {subpage === "profile" && user && (
          <div className="profile-grid">
            {/* SIDEBAR: Professional Airbnb Slim Card */}
            <aside className="profile-sidebar">
              <div className="id-card-slim">
                <div className="avatar-section">
                  <div className="native-avatar-wrapper">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        referrerPolicy="no-referrer"
                        alt={user.name}
                        className="native-avatar-img"
                        onError={(e) => {
                          // Fallback if image still fails
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="avatar-initials">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button className="edit-avatar-badge" aria-label="Edit photo">
                    <Camera size={14} />
                  </button>
                </div>

                <h1 className="user-title">{user.name.split(" ")[0]}</h1>
                <p className="role-label">Guest</p>
              </div>

              <div className="stats-box-slim">
                <div className="stat-row">
                  <span className="stat-val">0</span>
                  <span className="stat-lbl">Reviews</span>
                </div>
                <div className="stat-divider-v" />
                <div className="stat-row">
                  <span className="stat-val">1</span>
                  <span className="stat-lbl">Year</span>
                </div>
              </div>

              <div className="verification-card">
                <h3>{user.name.split(" ")[0]}’s confirmed info</h3>
                <div className="v-item">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                  <span>Email address</span>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <section className="profile-main-content">
              <div className="header-flex">
                <h2 className="profile-heading">About you</h2>
                <EditProfileDialog />
              </div>

              <div className="info-stack">
                <div className="info-block">
                  <User className="info-icon-main" size={24} />
                  <div className="info-content">
                    <span className="info-tag">Legal Name</span>
                    <p className="info-text-val">{user.name}</p>
                  </div>
                </div>

                <div className="info-block">
                  <Mail className="info-icon-main" size={24} />
                  <div className="info-content">
                    <span className="info-tag">Email Address</span>
                    <p className="info-text-val">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="action-row-bottom">
                <Button
                  variant="outline"
                  className="logout-minimal"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" /> Log out
                </Button>
              </div>

              <div className="host-cta-box">
                <div className="host-cta-content">
                  <h3>It's time to host</h3>
                  <p>Earn extra income by sharing your home with travelers.</p>
                </div>
                <Link to="/account/places/new" className="host-cta-btn">
                  List your space
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
