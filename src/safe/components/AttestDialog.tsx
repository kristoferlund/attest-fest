import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
  csv: string;
};

export function AttestDialog({ open, close }: AccountDialogProps) {
  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col w-64 gap-3 p-5 mx-auto bg-white border rounded-xl">
          <Dialog.Title className="flex justify-between text-2xl font-medium">
            Attest
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4" />
            </button>
          </Dialog.Title>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
