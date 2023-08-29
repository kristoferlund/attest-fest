import {
  faCheckCircle,
  faCircleNotch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { AttestDialogExecute } from "./AttestDialogExecute";
import { CopyButton } from "../../components/CopyButton";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parse } from "csv-parse/sync";
import { shortenEthAddress } from "../../util/string";
import { useEas } from "../../eas/hooks/useEas";
import { useNetwork } from "wagmi";
import { useSafe } from "../hooks/useSafe";
import { useSafeConfig } from "../hooks/useSafeConfig";
import { useStateStore } from "../../zustand/hooks/useStateStore";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function AttestDialog({ open, close }: AccountDialogProps) {
  const { createAttestationsTransaction, safeTransactionState } = useEas();
  const { safeAddress } = useSafe();
  const { chain } = useNetwork();
  const safeConfig = useSafeConfig(chain?.id);
  //Local state
  const [parsedCsv, setParsedCsv] = useState<string[][]>([[]]);

  // Global state
  const csv = useStateStore((state) => state.csv);

  function parseCsv() {
    if (!csv) return;
    setParsedCsv(
      parse(csv.trim(), {
        relax_column_count: true,
        relax_quotes: true,
        trim: true,
      })
    );
  }

  useEffect(parseCsv, [csv]);

  const submitButtonVisible =
    typeof safeTransactionState === "undefined" ||
    safeTransactionState?.status === "creating" ||
    safeTransactionState?.status === "signing" ||
    safeTransactionState?.status === "executing" ||
    safeTransactionState?.status === "error";

  const submitButtonDisabled =
    safeTransactionState?.status === "creating" ||
    safeTransactionState?.status === "signing" ||
    safeTransactionState?.status === "executing";

  const submitButtonWaiting = submitButtonDisabled;

  function submitButtonText() {
    if (safeTransactionState?.status === "creating") {
      return "Creating...";
    }
    if (safeTransactionState?.status === "signing") {
      return "Signing...";
    }
    if (safeTransactionState?.status === "executing") {
      return "Executing...";
    }
    return "Submit";
  }

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col gap-10 mx-auto bg-white border p-7 w-96 rounded-xl">
          <Dialog.Title className="flex justify-between text-2xl font-medium">
            Attest
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4" />
            </button>
          </Dialog.Title>

          {safeTransactionState?.txHash &&
          safeTransactionState.status === "created" ? (
            <div className="flex flex-col items-center gap-5">
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
              <div>Transaction proposed and signed!</div>
              <div>
                <a
                  href={`https://app.safe.global/transactions/tx?id=multisig_${safeAddress}_${safeTransactionState?.txHash}&safe=${safeConfig?.safeChainAbbreviation}:${safeAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1"
                >
                  {shortenEthAddress(safeTransactionState?.txHash || "")}
                </a>
                <CopyButton
                  textToCopy={
                    `https://app.safe.global/transactions/tx?id=multisig_${safeAddress}_${safeTransactionState?.txHash}&safe=${safeConfig?.safeChainAbbreviation}:${safeAddress}` ||
                    ""
                  }
                />
              </div>

              <AttestDialogExecute
                safeTxHash={safeTransactionState.txHash}
                onClose={close}
              />
            </div>
          ) : (
            <>
              <div className="px-10 text-center">
                Submitting will propose a Safe transaction to create{" "}
                <strong>{parsedCsv.length}</strong> attestation
                {parsedCsv.length > 1 && "s"}.
              </div>
              <div className="flex justify-center gap-5">
                <button onClick={close}>
                  {safeTransactionState?.status === "created"
                    ? "Close"
                    : "Cancel"}
                </button>

                {submitButtonVisible && (
                  <button
                    onClick={() => {
                      createAttestationsTransaction &&
                        createAttestationsTransaction(csv);
                    }}
                    disabled={submitButtonDisabled}
                  >
                    {submitButtonWaiting && (
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="w-4 mr-2"
                        spin
                      />
                    )}
                    <>{submitButtonText()}</>
                  </button>
                )}
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
