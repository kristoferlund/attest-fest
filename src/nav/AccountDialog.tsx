import { Dialog } from "@headlessui/react";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { shortenEthAddress } from "../util/string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";

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
        <Dialog.Panel className="flex flex-col w-64 gap-3 p-5 mx-auto bg-white border rounded-xl">
          <Dialog.Title className="flex justify-between text-2xl font-medium">
            Account
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4" />
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
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
