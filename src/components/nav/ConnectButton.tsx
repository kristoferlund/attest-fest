import { Button } from "../ui/Button";
import { ConnectDialog } from "../ConnectDialog";
import { useState } from "react";

export function ConnectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
      <ConnectDialog open={isOpen} close={() => setIsOpen(false)} />
    </>
  );
}
