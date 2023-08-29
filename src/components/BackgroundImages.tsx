import React, { CSSProperties, ReactElement } from "react";

interface BackgroundImagesProps {
  images: ReactElement[]; // Changed from string[] to ReactElement[]
  minSize: number;
  maxSize: number;
}

export const BackgroundImages: React.FC<BackgroundImagesProps> = ({
  images,
  minSize,
  maxSize,
}) => {
  const generateRandomStyle = (): CSSProperties => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const rotation = Math.random() * 360;
    const size = Math.random() * (maxSize - minSize) + minSize;

    return {
      position: "absolute",
      top: `${top}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
      width: `${size}%`,
    };
  };

  return (
    <>
      {images.map((SvgComponent, index) => (
        <div
          key={index}
          style={generateRandomStyle()}
          className="absolute opacity-50 fill-theme2"
        >
          {SvgComponent}
        </div>
      ))}
    </>
  );
};
