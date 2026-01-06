import * as React from "react";
import { Link, useLocation } from "react-router-dom";

// 1. Define the possible subpage types for strict typing
type SubpageType = "profile" | "bookings" | "places";

interface NavLinkItem {
  id: SubpageType;
  label: string;
  path: string;
  iconPath: string;
}

// 2. Navigation configuration
const NAV_LINKS: NavLinkItem[] = [
  {
    id: "profile",
    label: "My Profile",
    path: "/account",
    iconPath:
      "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    id: "bookings",
    label: "My bookings",
    path: "/account/bookings",
    iconPath:
      "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    id: "places",
    label: "My accomodations",
    path: "/account/places",
    iconPath:
      "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
  },
];

const AccountNavigation: React.FC = () => {
  const { pathname } = useLocation();

  // Extract subpage from URL, default to 'profile'
  let subpage: string | undefined = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  /**
   * Generates tailwind classes based on active state
   */
  const getLinkClasses = (type: SubpageType): string => {
    let classes =
      "flex items-center justify-center mx-10 md:mx-0 gap-2 py-2 px-6 rounded-full transition-all";
    if (type === subpage) {
      classes += " bg-primary text-white shadow-md";
    } else {
      classes += " bg-gray-200 text-gray-700 hover:bg-gray-300";
    }
    return classes;
  };

  return (
    <nav className="mt-24 mb-8 flex w-full flex-col justify-center gap-4 px-8 md:flex-row md:px-0">
      {NAV_LINKS.map((link) => (
        <Link key={link.id} className={getLinkClasses(link.id)} to={link.path}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={link.iconPath}
            />
          </svg>
          <span className="font-medium">{link.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default AccountNavigation;
