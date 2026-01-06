import React, { type ImgHTMLAttributes } from "react";

// We extend the standard HTML image attributes so that 'src', 'alt',
// and any other native props (like 'width' or 'onClick') are recognized.
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const Image: React.FC<ImageProps> = ({ src, ...rest }) => {
  return (
    <img
      src={src}
      alt="" // Providing a default empty alt for accessibility if not passed
      {...rest}
      className={`rounded-xl ${rest.className || ""}`}
    />
  );
};

export default Image;
