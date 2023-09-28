import { useAccount, useEnsName } from "wagmi";

import { AccountDialog } from "../AccountDialog";
import { shortenEthAddress } from "../../eth/util/shortenEthAddress";
import { useState } from "react";
import { ConnectButton } from "./ConnectButton";

export function AddressButton() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [isOpen, setIsOpen] = useState(false);

  if (!isConnected) {
    return <ConnectButton />;
  }

  return (
    <>
      <div
        className="px-5 py-3 border cursor-pointer bg-theme1 rounded-xl hover:bg-theme2"
        onClick={() => setIsOpen(true)}
      >
        {ensName ?? shortenEthAddress(address)}
      </div>
      <AccountDialog open={isOpen} close={() => setIsOpen(false)} />
    </>
  );
}
