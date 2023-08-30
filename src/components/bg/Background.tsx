import { BackgroundImages } from "./BackgroundImages";
import { Cert } from "./images/Cert";
import { Check } from "./images/Check";
import { Dots } from "./images/Dots";
import { Eyes } from "./images/Eyes";
import { Hat } from "./images/Hat";
import { Lines } from "./images/Lines";
import { Pop } from "./images/Pop";
import { Thumb } from "./images/Thumb";

const images = [
  <Cert />,
  <Check />,
  <Dots />,
  <Eyes />,
  <Hat />,
  <Lines />,
  <Pop />,
  <Thumb />,
  <Hat />,
  <Dots />,
];
const minSize = 2; // Minimum size in percentage
const maxSize = 10; // Maximum size in percentage

export function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <BackgroundImages images={images} minSize={minSize} maxSize={maxSize} />
    </div>
  );
}
