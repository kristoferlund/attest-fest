import Arbitrum from "./images/arbitrum.png";
import Base from "./images/base.png";
import Ethereum from "./images/ethereum.png";
import Linea from "./images/linea.png";
import Optimism from "./images/optimism.png";
import Polygon from "./images/polygon.png";
import Scroll from "./images/scroll.png";

const CHAIN_IMAGES: { [key: string]: string } = {
  Ethereum,
  "OP Mainnet": Optimism,
  "Arbitrum One": Arbitrum,
  Polygon,
  Base,
  Scroll,
  "Linea Mainnet": Linea,
  Sepolia: Ethereum,
  "Optimism Sepolia": Optimism,
  "Polygon Mumbai": Polygon,
  "Scroll Sepolia": Scroll,
};

const DEV_CHAINS = [
  "Sepolia",
  "Optimism Sepolia",
  "Scroll Sepolia",
  "Polygon Mumbai",
];

export function ChainIcon({
  chainName,
  className,
}: {
  chainName: string;
  className?: string;
}) {
  const devImage = DEV_CHAINS.includes(chainName) ? "grayscale opacity-50" : "";
  return (
    <div className={`flex items-center w-full gap-2 md:w-auto ${devImage}`}>
      <img
        src={CHAIN_IMAGES[chainName]}
        className={className}
        alt={chainName}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
