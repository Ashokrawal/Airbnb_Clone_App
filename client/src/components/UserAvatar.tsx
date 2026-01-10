import { Avatar, AvatarImage, AvatarFallback } from "@/components/Avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

export const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  // Logic to get initials (e.g., "John Doe" -> "JD")
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={className}>
      <AvatarImage
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className="object-cover"
      />

      {/* This shows ONLY if AvatarImage fails or src is empty */}
      <AvatarFallback className="bg-zinc-800 text-white font-medium">
        {initials || (
          // Airbnb-style Silhouette SVG
          <svg
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-full h-full p-2"
          >
            <path d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0 -5-5zm0 2a3 3 0 1 1 -3 3 3 3 0 0 1 3-3zm0 18c7 0 14 0 14-2a14 14 0 0 0 -28 0c0 2 7 2 14 2z" />
          </svg>
        )}
      </AvatarFallback>
    </Avatar>
  );
};
