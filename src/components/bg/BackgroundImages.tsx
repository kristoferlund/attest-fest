import React, { CSSProperties, ReactElement } from "react";

interface BackgroundImagesProps {
  images: ReactElement[]; // Changed from string[] to ReactElement[]
  minSize: number;
  maxSize: number;
  maxRepetitions: number; // Maximum number of times an image can be repeated
}

export const BackgroundImages: React.FC<BackgroundImagesProps> = ({
  images,
  minSize,
  maxSize,
  maxRepetitions,
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
      {images.map((SvgComponent, index) => {
        const repetitions = Math.floor(Math.random() * (maxRepetitions + 1));
        return Array.from({ length: repetitions }).map((_, repIndex) => (
          <div
            key={`${index}-${repIndex}`}
            style={generateRandomStyle()}
            className="absolute opacity-50 fill-theme3"
          >
            {SvgComponent}
          </div>
        ));
      })}
    </>
  );
};
