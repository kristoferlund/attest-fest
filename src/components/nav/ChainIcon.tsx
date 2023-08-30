import Ethereum from "./images/ethereum.png";
import Optimism from "./images/optimism.png";

const CHAIN_IMAGES: { [key: string]: string } = {
  Ethereum,
  "OP Mainnet": Optimism,
};

export function ChainIcon({
  chainName,
  className,
}: {
  chainName: string;
  className?: string;
}) {
  return (
    <img src={CHAIN_IMAGES[chainName]} className={className} alt={chainName} />
  );
}
