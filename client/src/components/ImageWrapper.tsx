import React from "react";
import NextImage from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ImageWrapperProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height" | "src"> {
  src: File;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  objectFit?: React.CSSProperties["objectFit"];
}

const ImageWrapper: React.FC<ImageWrapperProps> = ({
  src,
  alt,
  className = "",
  width = 500,
  height=300,
  layout = "intrinsic",
  objectFit = "contain",
}) => {

  return (
    <div className={className} style={{ position: "relative", width: width || "100%", height: height || "auto" }}>
      <NextImage
        src={src as unknown as StaticImport}
        alt={alt}
        layout={layout}
        width={ width}
        height={height}
        objectFit={objectFit}
      />
    </div>
  );
};

export default ImageWrapper;
