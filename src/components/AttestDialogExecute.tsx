import {
  faCheckCircle,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "./ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSafeTransaction } from "../safe/hooks/useSafeTransaction";
import { useNetwork } from "wagmi";
import { useSafeConfig } from "../safe/hooks/useSafeConfig";
import { useEas } from "../eas/hooks/useEas";
import { useEasConfig } from "../eas/hooks/useEasConfig";

type AttestDialogExecuteProps = {
  safeTxHash?: string;
  onClose?: () => void;
};

export function AttestDialogExecute({
  safeTxHash,
  onClose,
}: AttestDialogExecuteProps) {
  const { chain } = useNetwork();
  const safeConfig = useSafeConfig(chain?.id);
  const { schemaUid } = useEas();
  const easConfig = useEasConfig(chain?.id);

  const {
    moreConfirmationsRequired,
    executeTransaction,
    executeState,
    transaction,
  } = useSafeTransaction({
    safeTxHash,
  });

  const executeButtonDisabled =
    typeof executeState?.state !== "undefined" &&
    executeState?.state !== "error";

  const executeButtonWaiting =
    executeButtonDisabled && executeState?.state !== "executed";

  function executeButtonText() {
    if (executeState?.state === "executing") {
      return "Executing...";
    }
    if (executeState?.state === "indexing") {
      return "Indexing...";
    }
    if (executeState?.state === "executed") {
      return "Executed";
    }
    return "Execute";
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {moreConfirmationsRequired ? (
        <div className="text-center">
          The transaction needs more confirmations before it can be executed.
          Share the link above with the other owners to sign and execute the
          transaction.
        </div>
      ) : (
        <>
          <div className="px-5 text-center">
            Transaction requires no more confirmations and is ready to be
            executed.
          </div>
          <div className="flex justify-center gap-5">
            <Button onClick={onClose}>Close</Button>

            <Button
              onClick={() => executeTransaction && executeTransaction()}
              disabled={executeButtonDisabled}
            >
              {executeButtonWaiting && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="w-4 h-4 mr-2"
                  spin
                  size="2x"
                />
              )}
              {executeState?.state === "executed" && (
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 mr-2" />
              )}
              {executeButtonText()}
            </Button>
          </div>
          {executeState?.state === "executed" && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-center">
                Transaction:{" "}
                <a
                  href={`${safeConfig?.explorerUrl}/tx/${transaction?.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Etherscan
                </a>
              </div>
              <div className="text-center">
                Attestations:{" "}
                <a
                  href={`${easConfig?.explorerUrl}/schema/view/${schemaUid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Easscan
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
