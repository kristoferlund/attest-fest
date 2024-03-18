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

  const { data: ensName } = useEnsName({ address, chainId: 1 });

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="flex flex-col gap-3 p-5 mx-auto border bg-theme1 rounded-xl theme-shadow">
          <Dialog.Title className="flex justify-between">
            Account
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </Dialog.Title>

          <div
            className="flex gap-5 p-5 border hover:bg-theme2"
            onClick={() => {
              close();
              disconnect();
            }}
          >
            {ensName ?? shortenEthAddress(address)}
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
