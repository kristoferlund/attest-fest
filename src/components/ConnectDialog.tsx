import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useConnect } from "wagmi";

import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function ConnectDialog({ open, close }: AccountDialogProps) {
  const { connect, connectors, isLoading, pendingConnector, error } =
    useConnect();

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col gap-3 p-5 mx-auto border bg-theme1 w-80 rounded-xl theme-shadow">
          <Dialog.Title className="flex justify-between">
            Connect Wallet
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </Dialog.Title>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="flex justify-between p-5 border hover:bg-theme2"
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
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
