import { useAccount, useConnect, useEnsName } from "wagmi";

import { AccountDialog } from "../AccountDialog";
import { Button } from "../ui/Button";
import { shortenEthAddress } from "../../util/string";
import { useState } from "react";

export function Address() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors } = useConnect();
  const [isOpen, setIsOpen] = useState(false);

  if (!isConnected) {
    return (
      <Button onClick={() => connect({ connector: connectors[0] })}>
        Connect Wallet
      </Button>
    );
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
