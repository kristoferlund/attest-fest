import {
  faCheckCircle,
  faCircleNotch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import { BaseError } from "viem";
import { Button } from "./ui/Button";
import { CopyButton } from "./bg/images/CopyButton";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parse } from "csv-parse/sync";
import { plausible } from "../main";
import { shortenEthAddress } from "../eth/util/shortenEthAddress";
import { useEas } from "../eas/hooks/useEas";
import { useSafeConfig } from "../safe/hooks/useSafeConfig";
import { useStateStore } from "../zustand/hooks/useStateStore";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function AttestDialogEoa({ open, close }: AccountDialogProps) {
  const { chainId } = useAccount();
  const config = useSafeConfig(chainId);
  const {
    createAttestations,
    transactionStatus,
    transaction,
    transactionError,
    schemaUid,
  } = useEas();

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

  function submitButtonText() {
    if (transactionStatus === "creating" || transactionStatus === "attesting") {
      return "Submitting";
    }
    if (transactionStatus === "wait_uid") {
      return "Waiting to be minted";
    }
    return "Submit";
  }

  useEffect(() => {
    if (transactionStatus === "success" && chainId) {
      plausible.trackEvent("attestation-created", {
        props: { chain: chainId, wallet: "eoa", schema: schemaUid },
      });
    }
  }, [transactionStatus, schemaUid, chainId]);

  const pluralAttestation =
    parsedCsv.length > 1 ? "attestations" : "attestation";

  const inProgress =
    transactionStatus === "creating" ||
    transactionStatus === "attesting" ||
    transactionStatus === "wait_uid";

  const buttonDisabled = !parsedCsv.length || inProgress;

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center leading-loose">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col gap-10 p-5 mx-auto border bg-theme1 md:w-96 w-80 rounded-xl theme-shadow">
          <Dialog.Title className="flex justify-between">
            Attest
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </Dialog.Title>

          {transactionStatus === "success" ? (
            <div className="flex flex-col items-center gap-5">
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
              <div className="text-center">
                Transaction executed, {pluralAttestation} created!
              </div>
              <div>
                <a
                  href={`${config?.explorerUrl}/tx/${transaction?.tx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1"
                >
                  {shortenEthAddress(transaction?.tx.hash || "")}
                </a>
                <CopyButton textToCopy={`${transaction?.tx.hash}` || ""} />
              </div>

              <Button onClick={close}>Close</Button>
            </div>
          ) : (
            <>
              <div className="px-10 leading-loose text-center">
                Submit a transaction to create{" "}
                <strong>{parsedCsv.length}</strong> {pluralAttestation}.
              </div>

              {transactionStatus === "error" && (
                <div className="px-10 leading-loose text-center text-red-500">
                  {transactionError instanceof BaseError
                    ? transactionError.shortMessage
                    : (transactionError as Error)?.message}
                </div>
              )}

              <div className="flex flex-col justify-center gap-5 md:flex-row">
                <Button onClick={close}>Close</Button>

                <Button
                  onClick={() => {
                    createAttestations && createAttestations();
                  }}
                  disabled={buttonDisabled}
                >
                  {inProgress && (
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className="w-4 h-4 mr-2"
                      spin
                      size="2x"
                    />
                  )}
                  <>{submitButtonText()}</>
                </Button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
