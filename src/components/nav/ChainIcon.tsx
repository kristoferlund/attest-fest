import Arbitrum from "./images/arbitrum.png";
import Base from "./images/base.png";
import Ethereum from "./images/ethereum.png";
import Optimism from "./images/optimism.png";
import Polygon from "./images/polygon.png";

const CHAIN_IMAGES: { [key: string]: string } = {
  Ethereum,
  "OP Mainnet": Optimism,
  "Arbitrum One": Arbitrum,
  Polygon,
  Base,
  Sepolia: Ethereum,
  "Optimism Sepolia": Optimism,
};

export function ChainIcon({
  chainName,
  className,
}: {
  chainName: string;
  className?: string;
}) {
  return (
    <div className="flex items-center w-full gap-2 md:w-auto">
      <img
        src={CHAIN_IMAGES[chainName]}
        className={className}
        alt={chainName}
        style={{ imageRendering: "pixelated" }}
      />
      <div className="md:hidden">{chainName}</div>
    </div>
  );
}
