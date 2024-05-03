import { Connector, useAccount, useConnect } from "wagmi";

import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function ConnectDialog({ open, close }: AccountDialogProps) {
  const { connect, connectors, error, isPending } = useConnect();
  const { isConnected } = useAccount();

  const iconSource = (connector: Connector) => {
    // WalletConnect does not provide an icon, so we provide a custom one.
    if (connector.id === "walletConnect") {
      return "/walletconnect.svg";
    }
    return connector.icon;
  };

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="flex flex-col gap-3 p-5 mx-auto border bg-theme1 w-80 rounded-xl theme-shadow">
          <Dialog.Title className="flex justify-between">
            Connect Wallet
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </Dialog.Title>

          {connectors.map((connector) => (
            <button
              disabled={isConnected || isPending}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="flex justify-between p-5 border hover:bg-theme2"
            >
              {connector.name}
              <img className="w-4 h-4" src={iconSource(connector)} />
            </button>
          ))}
          {error && (
            <div className="p-2 text-center text-white bg-red-500">
              {error.message}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
