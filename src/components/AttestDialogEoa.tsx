import {
  faCheckCircle,
  faCircleNotch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { BaseError } from "viem";
import { Button } from "./ui/Button";
import { CopyButton } from "./bg/images/CopyButton";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parse } from "csv-parse/sync";
import { shortenEthAddress } from "../eth/util/shortenEthAddress";
import { useEasMultiAttest } from "../eas/hooks/useEasMultiAttest";
import { useNetwork } from "wagmi";
import { useSafeConfig } from "../safe/hooks/useSafeConfig";
import { useStateStore } from "../zustand/hooks/useStateStore";

type AccountDialogProps = {
  open: boolean;
  close: () => void;
};

export function AttestDialogEoa({ open, close }: AccountDialogProps) {
  const { contract, transaction } = useEasMultiAttest();
  const { chain } = useNetwork();
  const config = useSafeConfig(chain?.id);

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
    if (contract.isLoading) {
      return "Submitting";
    }
    if (transaction.isFetching) {
      return "Executing";
    }
    return "Submit";
  }

  const pluralAttestation =
    parsedCsv.length > 1 ? "attestations" : "attestation";

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

          {transaction.isSuccess ? (
            <div className="flex flex-col items-center gap-5">
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
              <div className="text-center">
                Transaction executed, {pluralAttestation} created!
              </div>
              <div>
                <a
                  href={`${config?.explorerUrl}/tx/${contract.data?.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1"
                >
                  {shortenEthAddress(contract.data?.hash || "")}
                </a>
                <CopyButton textToCopy={`${contract.data?.hash}` || ""} />
              </div>

              <Button onClick={close}>Close</Button>
            </div>
          ) : (
            <>
              <div className="px-10 leading-loose text-center">
                Submit a transaction to create{" "}
                <strong>{parsedCsv.length}</strong> {pluralAttestation}.
              </div>

              {contract.isError && (
                <div className="px-10 leading-loose text-center text-red-500">
                  {contract.error instanceof BaseError
                    ? contract.error?.shortMessage
                    : contract.error?.message}
                </div>
              )}

              <div className="flex flex-col justify-center gap-5 md:flex-row">
                <Button onClick={close}>Close</Button>

                <Button
                  onClick={() => {
                    contract.write?.();
                  }}
                  disabled={contract.isLoading || transaction.isFetching}
                >
                  {(contract.isLoading || transaction.isFetching) && (
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
