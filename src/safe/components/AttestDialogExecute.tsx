import {
  faCheckCircle,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSafeTransaction } from "../hooks/useSafeTransaction";

type AttestDialogExecuteProps = {
  safeTxHash?: string;
  onClose?: () => void;
};

export function AttestDialogExecute({
  safeTxHash,
  onClose,
}: AttestDialogExecuteProps) {
  const { moreConfirmationsRequired, executeTransaction, executeState } =
    useSafeTransaction({
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
            <button onClick={onClose}>Close</button>

            <button
              onClick={() => executeTransaction && executeTransaction()}
              disabled={executeButtonDisabled}
            >
              {executeButtonWaiting && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="w-4 mr-2"
                  spin
                />
              )}
              {executeState?.state === "executed" && (
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 mr-2" />
              )}
              {executeButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
