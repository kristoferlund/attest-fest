import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAccount, useDisconnect, useEnsName } from "wagmi";

import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shortenEthAddress } from "../eth/util/shortenEthAddress";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function AccountDialog({ open, close }: AccountDialogProps) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: ensName } = useEnsName({ address });

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col gap-3 p-5 mx-auto border bg-theme1 w-96 rounded-xl">
          <Dialog.Title className="flex justify-between">
            Account
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </Dialog.Title>

          <div className="flex justify-between p-5 border">
            {ensName ?? shortenEthAddress(address)}
            <button
              onClick={() => {
                close();
                disconnect();
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
