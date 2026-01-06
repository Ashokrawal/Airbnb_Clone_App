import * as React from "react";

// 1. Define the interface for the component props
interface AddressLinkProps {
  placeAddress: string;
  className?: string; // Optional prop
}

const AddressLink: React.FC<AddressLinkProps> = ({
  placeAddress,
  className = "my-3 block", // Default value assigned here
}) => {
  // 2. Combine classes safely
  // We add the base functional classes to whatever is passed or defaulted
  const combinedClassName = `${className} flex gap-1 font-semibold underline`;

  return (
    <a
      className={combinedClassName}
      href={`https://maps.google.com/?q=${encodeURIComponent(placeAddress)}`}
      target="_blank"
      rel="noopener noreferrer" // Added for security best practices
    >
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
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>

      {placeAddress}
    </a>
  );
};

export default AddressLink;
