import Base from "./images/base.png";
import Ethereum from "./images/ethereum.png";
import Optimism from "./images/optimism.png";

const CHAIN_IMAGES: { [key: string]: string } = {
  Base,
  "Base Sepolia": Base,
  Ethereum,
  "Ethereum Sepolia": Ethereum,
  "OP Mainnet": Optimism,
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
      />
      <div className="md:hidden">{chainName}</div>
    </div>
  );
}
